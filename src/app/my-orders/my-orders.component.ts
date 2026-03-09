import { Component, OnInit } from '@angular/core';
import { OrderApiService } from '../service/order-api.service.js';
import { LocalStorageService } from '../service/local-storage.service.js';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { FooterComponent } from '../footer/footer.component.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  userId: number | null = null;
  showCancelSuccessMessage: boolean = false;

  // NUEVAS VARIABLES PARA EL MODAL DE DETALLES
  selectedOrder: any = null;
  isDetailsModalOpen: boolean = false;

  constructor(
    private orderService: OrderApiService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    const userIdFromStorage = this.localStorageService.getItem('idUsuario');
    this.userId = userIdFromStorage ? parseInt(userIdFromStorage, 10) : null;

    if (this.userId !== null) {
      this.orderService.findOrderbyUser(this.userId).subscribe({
        next: (data) => {
          this.orders = data; // Aquí va directo, porque el back manda el array pelado
          console.log('Ahora sí, con productos:', data);
        },
        error: (error) => {
          console.error('Error al obtener las órdenes:', error);
        },
        complete: () => {
          console.log('La solicitud de órdenes se completó con éxito.');
        }
      });
    }
  }

  // FUNCIONES PARA EL MODAL DE DETALLES
  openDetailsModal(order: any) {
    this.selectedOrder = order;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
    this.selectedOrder = null;
  }

  cancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId).subscribe({
      next: (response) => {
        console.log('Pedido cancelado exitosamente:', response);
        this.showCancelSuccessMessage = true;

        // Opcional: Actualizar el estado localmente sin recargar toda la página
        const order = this.orders.find(o => o.id === orderId);
        if (order) order.estado = 'Cancelado';
      },
      error: (error) => {
        console.error('Error al cancelar el pedido:', error);
      }
    });
  }

  closeCancelSuccessMessage() {
    this.showCancelSuccessMessage = false;
    // En lugar de reload(), podrías simplemente dejar que la actualización local haga su trabajo
    // Pero si prefieres asegurar, el reload() funciona:
    window.location.reload();
  }

  downloadInvoice(order: any) {
    const doc = new jsPDF();

    // 1. Encabezado - Estilo Sportify
    doc.setFillColor(31, 41, 55); // Color gris oscuro (gray-900)
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SPORTIFY', 15, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Comprobante de Compra Online', 15, 32);

    // 2. Información del Pedido
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Pedido N°: #${order.id}`, 15, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${new Date(order.fecha_pedido).toLocaleDateString()}`, 15, 62);
    doc.text(`Método de Pago: ${order.metodo_pago}`, 15, 69);
    doc.text(`Estado: ${order.estado}`, 15, 76);

    // 3. Tabla de Productos
    const tableData = order.orderItems.map((item: any) => [
      item.product?.name || 'Producto',
      item.quantity.toString(),
      `$${item.item_price.toFixed(2)}`,
      `$${(item.item_price * item.quantity).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 85,
      head: [['Producto', 'Cant.', 'Precio Unit.', 'Subtotal']],
      body: tableData,
      headStyles: { fillColor: [220, 38, 38] }, // Rojo Sportify (red-600)
      theme: 'striped',
      margin: { left: 15, right: 15 }
    });

    // 4. Total Final
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL FINAL: $${order.total.toFixed(2)}`, 140, finalY);

    // 5. Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Gracias por elegir Sportify - Tu tienda de deportes favorita.', 105, 285, { align: 'center' });

    // 6. Descarga del archivo
    doc.save(`Comprobante_Sportify_#${order.id}.pdf`);
  }
}
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiProductService } from '../service/productApi.service.js';
import { OrderApiService } from '../service/order-api.service.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { FooterComponent } from '../footer/footer.component.js';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dahsboard',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './dahsboard.component.html',
  styleUrl: './dahsboard.component.scss'
})
export class DahsboardComponent implements OnInit {

  @ViewChild('brandChart') brandChart!: ElementRef;
  @ViewChild('stockChart') stockChart!: ElementRef;
  @ViewChild('orderStatusChart') orderStatusChart!: ElementRef; // Nueva referencia

  stats = {
    totalVentas: 0,
    totalPedidosCount: 0,      // Total de pedidos (incluyendo cancelados)
    porcentajeCancelados: 0,   // Porcentaje calculado
    productosBajoStock: [] as any[],
    ventasPorMarca: [] as any[],
    pedidosRecientes: [] as any[]
  };

  constructor(
    private productService: ApiProductService,
    private orderService: OrderApiService
  ) { }

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    // 1. Productos y Stock
    this.productService.getProductsData().subscribe((response: any) => {
      const products = response.data || response;
      if (Array.isArray(products)) {
        this.stats.productosBajoStock = products.filter((p: any) => p.stock < 5);

        setTimeout(() => {
          if (this.stockChart && this.brandChart) {
            this.renderStockChart(products);
            this.renderBrandChart(products);
          }
        }, 100);
      }
    });

    // 2. Pedidos y Métricas de Cancelación
    this.orderService.getAllOrders().subscribe((response: any) => {
      const allOrders = response.data || response;

      if (Array.isArray(allOrders)) {
        this.stats.totalPedidosCount = allOrders.length;

        // Filtramos estados
        const validOrders = allOrders.filter((o: any) => o.estado !== 'Cancelado');
        const canceledOrders = allOrders.filter((o: any) => o.estado === 'Cancelado');

        // Calculamos Ingresos Reales (solo pedidos no cancelados)
        this.stats.totalVentas = validOrders.reduce((acc: number, o: any) => acc + (Number(o.total) || 0), 0);

        // Calculamos Porcentaje de Cancelados
        if (this.stats.totalPedidosCount > 0) {
          this.stats.porcentajeCancelados = (canceledOrders.length / this.stats.totalPedidosCount) * 100;
        }

        // Últimos 5 movimientos (incluyendo cancelados para auditoría)
        this.stats.pedidosRecientes = allOrders.slice(-5).reverse();

        // Renderizamos el nuevo gráfico de torta
        setTimeout(() => {
          if (this.orderStatusChart) {
            this.renderOrderStatusChart(validOrders.length, canceledOrders.length);
          }
        }, 100);
      }
    }, error => {
      console.error('Error al obtener pedidos:', error);
    });
  }

  renderOrderStatusChart(validos: number, cancelados: number) {
    const ctx = this.orderStatusChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'pie', // Gráfico de torta
      data: {
        labels: ['Válidos', 'Cancelados'],
        datasets: [{
          data: [validos, cancelados],
          backgroundColor: ['#10b981', '#ef4444'], // Verde y Rojo Sportify
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  renderStockChart(products: any[]) {
    const ctx = this.stockChart.nativeElement.getContext('2d');

    // Limitar a los 5 o 7 productos con menos stock para que no sea infinita
    const lowStockProducts = products.filter(p => p.stock > 0).slice(0, 6);

    new Chart(ctx, {
      type: 'bar', // Mantenemos bar
      data: {
        labels: lowStockProducts.map(p => p.name), // Nombres completos
        datasets: [{
          label: 'Unidades en Stock',
          data: lowStockProducts.map(p => p.stock),
          backgroundColor: 'rgba(220, 38, 38, 0.8)', // Rojo Sportify (red-600)
          borderColor: '#b91c1c',
          borderWidth: 1,
          borderRadius: 5 // Bordes redondeados para un look premium
        }]
      },
      options: {
        indexAxis: 'y', // <--- ESTA ES LA CLAVE PARA GIRARLO
        responsive: true,
        maintainAspectRatio: false, // Permite que ocupe el alto del contenedor
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Stock: ${context.formattedValue} un.`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { display: false },
            ticks: { font: { size: 11, weight: 'bold' } }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { size: 10 },
              // Esta función corta el texto si es muy largo para que no rompa el diseño
              callback: function (value) {
                const label = this.getLabelForValue(value as number);
                if (label.length > 25) {
                  return label.substr(0, 25) + '...'; // Corta a 25 caracteres + ...
                }
                return label;
              }
            }
          }
        }
      }
    });
  }

  renderBrandChart(products: any[]) {
    const marcasMap: any = {};
    products.forEach(p => {
      const brandName = p.brand?.name || 'Otras';
      marcasMap[brandName] = (marcasMap[brandName] || 0) + 1;
    });

    const ctx = this.brandChart.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(marcasMap),
        datasets: [{
          data: Object.values(marcasMap),
          backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#6366f1'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }
}
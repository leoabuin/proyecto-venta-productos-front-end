import { Component, OnInit } from '@angular/core';
import { OrderApiService } from '../service/order-api.service.js';
import { LocalStorageService } from '../service/local-storage.service.js';
import { NavbarComponent } from '../../navbar/navbar.component.js';
import { FooterComponent } from '../footer/footer.component.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [NavbarComponent,FooterComponent,FormsModule,CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = []
  userId: number | null = null
  showCancelSuccessMessage: boolean = false


  constructor(
    private orderService: OrderApiService,
    private localStorageService: LocalStorageService) {
    }

  
    ngOnInit(): void {
      const userIdFromStorage = this.localStorageService.getItem('idUsuario');
      this.userId = userIdFromStorage ? parseInt(userIdFromStorage, 10) : null;
  
      if (this.userId !== null) {
        this.orderService.findOrderbyUser(this.userId).subscribe({
          next: (data) => {
            this.orders = data;
            console.log(data)
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


  cancelOrder(orderId:number):void{
    this.orderService.cancelOrder(orderId).subscribe({
      next: (response) => {
        console.log('Pedido cancelado exitosamente:', response)
        this.showCancelSuccessMessage = true
      },
      error: (error) => {
        console.error('Error al cancelar el pedido:', error);
        // Manejar errores si es necesario
      }
    })
  }

  closeCancelSuccessMessage() {
    this.showCancelSuccessMessage = false;
    window.location.reload();
  }

  

  

}

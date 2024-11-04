import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../service/local-storage.service.js';
import { FooterComponent } from '../footer/footer.component.js';
import { OrderApiService } from '../service/order-api.service.js';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FooterComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
  
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  orderItem:any[] = []
  total: number = 0
  constructor(
    private localStorageService: LocalStorageService,
    private orderService: OrderApiService
  ){
    const cart = this.localStorageService.getItem('cartToshow');
    this.cartItems = cart ? JSON.parse(cart) : []; // Convierte el string a un array
    console.log(this.cartItems);
  }
  ngOnInit() {
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((accumulator, item) => {
      return accumulator + (item.item_price)
    }, 0);
  }

  submitOrder(){
    

    const userIdString = this.localStorageService.getItem('idUsuario') as string; // Obtener el ID de usuario como string

    // Convertir de string a int
    const userId = parseInt(userIdString, 10);

    
    const orderItem = this.localStorageService.getItem('cart')
    if (orderItem) {
      const cartItems = JSON.parse(orderItem);
    }
    const orderItems = this.cartItems.map(item => ({
      productId: item.productId, 
      quantity: item.quantity, 
      item_price: item.item_price
    }));
  

    const orderData = {
      orderItems,
      fecha_pedido: formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ssZ', 'en-US'),
      total: this.total,
      estado: "pending",
      metodo_pago: "Debit_card",
      userId: userId
    }
    console.log(orderData)

    this.orderService.placeOrder(orderData).subscribe({
      next: (response) => {
        console.log('Pedido registrado:', response);
        this.localStorageService.removeItem('cart')
        this.localStorageService.removeItem('cartToshow')
      },

    })



  }

  



}

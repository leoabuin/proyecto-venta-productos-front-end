import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../service/local-storage.service.js';
import { FooterComponent } from '../footer/footer.component.js';
import { OrderApiService } from '../service/order-api.service.js';
import { formatDate } from '@angular/common';
import { Router, RouterModule } from '@angular/router'
import emailjs from '@emailjs/browser';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component'
import { environment } from '../environment';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FooterComponent, RouterModule,LoadingSpinnerComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'

})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  orderItem: any[] = []
  total: number = 0
  showOrderDone: boolean = false
  isLoading: boolean = false

  constructor(
    private localStorageService: LocalStorageService,
    private orderService: OrderApiService,
    private router: Router
  ) {
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

  //logica del envio de email con emailjs
  sendEmailInvoice(orderId: number) {
    const username = this.localStorageService.getItem('username') || 'Cliente';
    // Nota: Si no tenés el email guardado, podés pedirlo en un input o sacarlo del auth
    const userEmail = this.localStorageService.getItem('userEmail') || 'tu-email-de-prueba@gmail.com';

    // Formateamos los productos para el mail
    const itemsHTML = this.cartItems.map(item =>
      `- ${item.name} (x${item.quantity}): $${item.item_price}`
    ).join('<br>');

    const templateParams = {
      order_id: orderId,
      user_name: username,
      user_email: userEmail,
      detalle_productos: itemsHTML,
      total_compra: this.total,
      fecha: formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en-US')
    };

    emailjs.send(
      environment.emailjs_service_id,
      environment.emailjs_template_id,   
      templateParams,
      environment.emailjs_public_key
    )
      .then(() => console.log('Factura enviada por mail'))
      .catch((err) => console.error('Error al enviar mail:', err));
  }

  removeItem(productId: number) {
    const cartToShow = this.localStorageService.getItem('cartToshow');
    if (cartToShow) {
      const updatedCartToShow = JSON.parse(cartToShow).filter((item: any) => item.productId !== productId)
      this.localStorageService.setItem('cartToshow', JSON.stringify(updatedCartToShow))
    }
    const cart = this.localStorageService.getItem('cart')
    if (cart) {
      const updatedCart = JSON.parse(cart).filter((item: any) => item.productId !== productId)
      this.localStorageService.setItem('cart', JSON.stringify(updatedCart))
    }
    this.cartItems = this.cartItems.filter(item => item.productId !== productId)
    this.calculateTotal()
  }

  submitOrder() {
    this.isLoading = true
    const userIdString = this.localStorageService.getItem('idUsuario') as string
    const userId = parseInt(userIdString, 10)

    const orderItem = this.localStorageService.getItem('cart')
    if (orderItem) {
      const cartItems = JSON.parse(orderItem)
    }
    const orderItems = this.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      item_price: item.item_price
    }))



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
        console.log('Pedido registrado:', response)
        this.sendEmailInvoice(response.id || Math.floor(Math.random() * 1000));
        this.localStorageService.removeItem('cart')
        this.localStorageService.removeItem('cartToshow')
      },
    })
    this.isLoading = false
    this.showOrderDone = true
  }

  closeOrderDoneSuccessMessage() {
    this.showOrderDone = false
    this.router.navigate(['/home'])
  }





}

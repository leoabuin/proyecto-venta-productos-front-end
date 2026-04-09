import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../service/local-storage.service.js';
import { FooterComponent } from '../footer/footer.component.js';
import { OrderApiService } from '../service/order-api.service.js';
import { PaymentService } from '../service/payment.service.js';
import { formatDate } from '@angular/common';
import { Router, RouterModule } from '@angular/router'
import emailjs from '@emailjs/browser';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component'
import { environment } from '../environment';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FooterComponent, RouterModule, LoadingSpinnerComponent, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'

})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  orderItem: any[] = []
  total: number = 0
  showOrderDone: boolean = false
  isLoading: boolean = false
  
  // Coupon & Discount tracking
  couponCode: string = '';
  appliedCoupon: any = null;
  couponError: string = '';
  volumeDiscountTotal: number = 0;
  couponDiscountAmount: number = 0;
  originalSubtotal: number = 0;

  constructor(
    private localStorageService: LocalStorageService,
    private orderService: OrderApiService,
    private paymentService: PaymentService,
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
    this.volumeDiscountTotal = 0;
    this.couponDiscountAmount = 0;

    // 1. Subtotal original (sin descuentos)
    this.originalSubtotal = this.cartItems.reduce((acc, item) => acc + item.item_price, 0);

    // 2. Aplicar descuento por volumen (20% OFF si cantidad >= 3)
    const subtotalAfterVolume = this.cartItems.reduce((accumulator, item) => {
      let itemPrice = item.item_price;
      if (item.quantity >= 3) {
        const discountAmount = item.item_price * 0.2;
        this.volumeDiscountTotal += discountAmount;
        itemPrice = item.item_price - discountAmount;
      }
      return accumulator + itemPrice;
    }, 0);

    // 3. Aplicar descuento de cupón sobre el subtotal ya descontado por volumen
    if (this.appliedCoupon) {
      this.couponDiscountAmount = subtotalAfterVolume * (this.appliedCoupon.discountPercentage / 100);
    }

    this.total = subtotalAfterVolume - this.couponDiscountAmount;
  }

  applyCoupon() {
    if (!this.couponCode) {
      this.couponError = 'Por favor ingrese un código';
      return;
    }

    this.isLoading = true;
    this.orderService.validateCoupon(this.couponCode).subscribe({
      next: (response) => {
        const coupon = response.data || response;
        
        // Basic frontend validation
        const now = new Date();
        const expirationDate = new Date(coupon.expirationDate);
        
        if (expirationDate < now) {
          this.couponError = 'El cupón ha expirado';
          this.appliedCoupon = null;
        } else {
          this.appliedCoupon = coupon;
          this.couponError = '';
          this.calculateTotal();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al validar cupón:', error);
        this.couponError = 'Cupón inválido o no encontrado';
        this.appliedCoupon = null;
        this.calculateTotal();
        this.isLoading = false;
      }
    });
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.couponCode = '';
    this.calculateTotal();
  }

  //logica del envio de email con emailjs
  sendEmailInvoice(orderId: number) {
    const username = this.localStorageService.getItem('username') || 'Cliente'
    const userEmail = this.localStorageService.getItem('userEmail')

    // Validación de seguridad: Si no hay mail, no disparamos EmailJS
    if (!userEmail) {
      console.warn("No se pudo enviar la factura: Falta el email del usuario.")
      return
    }

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
      metodo_pago: "Mercado Pago",
      userId: userId,
      couponId: this.appliedCoupon ? this.appliedCoupon.id : null
    }
    console.log('Creando orden:', orderData)

    // Paso 1: Crear la orden en el backend
    this.orderService.placeOrder(orderData).subscribe({
      next: (response) => {
        console.log('Orden creada exitosamente:', response)
        const orderId = response.id || response.data?.id
        
        if (!orderId) {
          this.isLoading = false
          alert('Error: No se pudo obtener el ID de la orden')
          return
        }

        // Guardar el orderId en localStorage para usar después en la página de éxito
        this.localStorageService.setItem('currentOrderId', String(orderId))

        // Paso 2: Crear la preferencia de pago en Mercado Pago
        const paymentItems = this.cartItems.map(item => ({
          productId: item.productId,
          id: String(item.productId),
          title: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price || (item.item_price / item.quantity)
        }))

        console.log('Creando preferencia de pago para orden #' + orderId)
        this.paymentService.createPaymentPreference(orderId, paymentItems).subscribe({
          next: (paymentResponse) => {
            console.log('Preferencia de pago creada:', paymentResponse)
            const initPoint = paymentResponse.init_point || paymentResponse.sandbox_init_point
            
          if (initPoint) {
              // Limpiar el carrito ANTES de salir hacia Mercado Pago
              this.localStorageService.removeItem('cart')
              this.localStorageService.removeItem('cartToshow')
              // Guardar el orderId para usarlo en la página de éxito
              this.localStorageService.setItem('currentOrderId', String(orderId))
              console.log('Redirigiendo a Mercado Pago:', initPoint)
              window.location.href = initPoint
              this.isLoading = false
            } else {
              this.isLoading = false
              alert('Error: No se pudo obtener el enlace de pago de Mercado Pago')
            }
          },
          error: (error) => {
            console.error('Error al crear preferencia de pago:', error)
            this.isLoading = false
            alert('Error al procesar el pago. Por favor, intenta nuevamente.')
          }
        })
      },
      error: (error) => {
        console.error('Error al crear la orden:', error)
        this.isLoading = false
        alert('Error al crear la orden. Por favor, intenta nuevamente.')
      }
    })
  }

  closeOrderDoneSuccessMessage() {
    this.showOrderDone = false
    this.router.navigate(['/home'])
  }





}

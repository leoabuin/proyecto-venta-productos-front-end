import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';
import { PaymentService, MercadoPagoPaymentResponse } from '../service/payment.service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent implements OnInit {
  orderId: number | null = null;
  paymentId: string | null = null;
  isLoading: boolean = true;
  message: string = 'Procesando tu pago...';
  paymentStatus: string | null = null;
  retryCount: number = 0;
  maxRetries: number = 3;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    // MP incluye estos params en la URL de redirección:
    // ?payment_id=XXX&status=approved&external_reference=ORDER_ID&...
    const params = this.route.snapshot.queryParams;
    this.paymentId = params['payment_id'] || params['collection_id'] || null;

    // Intentar obtener orderId desde URL o desde localStorage
    const externalRef = params['external_reference'] || params['orderId'];
    const storedOrderId = this.localStorageService.getItem('currentOrderId');
    this.orderId = externalRef ? Number(externalRef) : (storedOrderId ? Number(storedOrderId) : null);

    console.log('[PaymentSuccess] payment_id:', this.paymentId, '| orderId:', this.orderId);

    if (this.orderId) {
      this.verifyPaymentStatus();
    } else {
      this.isLoading = false;
      this.message = 'No se encontró la orden. Por favor, revisá tus pedidos.';
    }
  }

  verifyPaymentStatus(): void {
    if (!this.orderId) return;

    console.log(`[PaymentSuccess] Verificando pago para orden #${this.orderId}, payment_id: ${this.paymentId}`);

    this.paymentService.verifyPayment(this.orderId, this.paymentId ?? undefined).subscribe({
      next: (response: MercadoPagoPaymentResponse) => {
        console.log('[PaymentSuccess] Respuesta:', response);

        this.paymentStatus = response.paymentStatus;

        if (response.orderStatus === 'Pagado' || response.paymentStatus === 'approved') {
          this.isLoading = false;
          this.message = '¡Pago completado exitosamente!';
          this.localStorageService.removeItem('cart');
          this.localStorageService.removeItem('cartToshow');
          this.localStorageService.removeItem('currentOrderId');
        } else if (response.paymentStatus === 'pending' || response.paymentStatus === 'in_process') {
          if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            this.message = `Procesando tu pago... (Intento ${this.retryCount}/${this.maxRetries})`;
            setTimeout(() => this.verifyPaymentStatus(), 3000);
          } else {
            this.isLoading = false;
            this.message = 'Tu pago está siendo procesado. Será confirmado en poco tiempo.';
          }
        } else if (response.orderStatus === 'Rechazado' || response.paymentStatus === 'rejected') {
          this.isLoading = false;
          this.message = 'Tu pago fue rechazado. Intenta nuevamente.';
          setTimeout(() => this.router.navigate(['/payment/failure']), 2000);
        } else {
          this.isLoading = false;
          this.message = 'Estado de pago desconocido. Por favor revisá tus pedidos.';
        }
      },
      error: (error: any) => {
        console.error('[PaymentSuccess] Error al verificar pago:', error);
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          this.message = `Verificando estado del pago... (Intento ${this.retryCount}/${this.maxRetries})`;
          setTimeout(() => this.verifyPaymentStatus(), 2000);
        } else {
          this.isLoading = false;
          this.message = 'No pudimos verificar tu pago. Por favor revisá tus pedidos.';
        }
      }
    });
  }

  goToHome(): void { this.router.navigate(['/home']); }

  goToMyOrders(): void {
    const userId = this.localStorageService.getItem('idUsuario');
    if (userId) this.router.navigate([`/myOrders/${userId}`]);
  }
}

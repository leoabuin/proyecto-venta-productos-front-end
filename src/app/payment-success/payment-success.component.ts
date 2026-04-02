import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  isLoading: boolean = true;
  message: string = 'Procesando tu pago...';
  paymentStatus: string | null = null;
  retryCount: number = 0;
  maxRetries: number = 3;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    // Obtener el orderId del localStorage (se guardó antes de redirigir a MP)
    const storedOrderId = this.localStorageService.getItem('currentOrderId');
    
    if (storedOrderId) {
      this.orderId = Number(storedOrderId);
      // Usar verifyPayment para obtener el estado real de Mercado Pago
      this.verifyPaymentStatus();
    } else {
      this.isLoading = false;
      this.message = 'No se encontró la orden. Por favor, intenta nuevamente.';
    }
  }

  /**
   * Verifica el estado del pago con Mercado Pago
   * Si el pago fue aprobado, actualiza el estado de la orden a PAGADO
   */
  verifyPaymentStatus(): void {
    if (!this.orderId) return;

    console.log(`[PaymentSuccess] Verificando estado del pago para orden #${this.orderId}`);
    
    this.paymentService.verifyPayment(this.orderId).subscribe({
      next: (response: MercadoPagoPaymentResponse) => {
        console.log('[PaymentSuccess] Respuesta completa:', response);
        console.log('[PaymentSuccess] Estado del pago (MP):', response.paymentStatus);
        console.log('[PaymentSuccess] Estado de orden (BD):', response.orderStatus);
        
        this.paymentStatus = response.paymentStatus;

        // Usar orderStatus para validar si la BD fue actualizada
        if (response.orderStatus === 'Pagado' || response.paymentStatus === 'approved') {
          // ✅ Pago aprobado y orden actualizada en BD
          console.log('[PaymentSuccess] ✅ Pago APROBADO - Orden actualizada a PAGADO');
          this.isLoading = false;
          this.message = '¡Pago completado exitosamente!';
          this.localStorageService.removeItem('cart');
          this.localStorageService.removeItem('cartToshow');
          this.localStorageService.removeItem('currentOrderId');
        } else if (response.orderStatus === 'Pago Pendiente' || response.paymentStatus === 'pending' || response.paymentStatus === 'in_process') {
          // ⏳ Pago aún está siendo procesado
          console.log('[PaymentSuccess] ⏳ Pago pendiente de procesar');
          if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`[PaymentSuccess] Reintentando en 3 segundos... (${this.retryCount}/${this.maxRetries})`);
            this.message = `Procesando tu pago... (Intento ${this.retryCount}/${this.maxRetries})`;
            // Reintentar después de 3 segundos
            setTimeout(() => this.verifyPaymentStatus(), 3000);
          } else {
            // Si no se confirma después de 3 intentos, mostrar página de pendiente
            console.warn('[PaymentSuccess] Máximo de intentos alcanzado');
            this.isLoading = false;
            this.message = 'Tu pago está siendo procesado. Será confirmado en poco tiempo.';
          }
        } else if (response.orderStatus === 'Rechazado' || response.paymentStatus === 'rejected') {
          // ❌ Pago rechazado
          console.log('[PaymentSuccess] ❌ Pago RECHAZADO');
          this.isLoading = false;
          this.message = 'Tu pago fue rechazado. Intenta nuevamente.';
          // Redirigir a página de fallo después de 2 segundos
          setTimeout(() => this.router.navigate(['/payment/failure']), 2000);
        } else {
          // Estado desconocido
          console.warn('[PaymentSuccess] Estado de pago desconocido:', response.orderStatus, response.paymentStatus);
          this.isLoading = false;
          this.message = 'Estado de pago desconocido. Por favor contacta soporte.';
        }
      },
      error: (error: any) => {
        console.error('[PaymentSuccess] Error al verificar pago:', error);
        
        // Reintentar en caso de error de conexión
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`[PaymentSuccess] Reintentando por error... (${this.retryCount}/${this.maxRetries})`);
          this.message = `Verificando estado del pago... (Intento ${this.retryCount}/${this.maxRetries})`;
          setTimeout(() => this.verifyPaymentStatus(), 2000);
        } else {
          console.error('[PaymentSuccess] Máximo de intentos alcanzado');
          this.isLoading = false;
          this.message = 'No pudimos verificar tu pago. Por favor contacta soporte.';
        }
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToMyOrders(): void {
    const userId = this.localStorageService.getItem('idUsuario');
    if (userId) {
      this.router.navigate([`/myOrders/${userId}`]);
    }
  }
}

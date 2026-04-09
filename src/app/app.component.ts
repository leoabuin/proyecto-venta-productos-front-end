import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaymentService } from './service/payment.service';
import { LocalStorageService } from './service/local-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'proyecto-venta-productos-front-end';

  constructor(
    private paymentService: PaymentService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.checkPendingPayment();
  }

  /**
   * Si hay un pedido pendiente en localStorage (currentOrderId),
   * verifica con el backend si el pago fue aprobado en MP.
   * Esto cubre el caso en que MP no redirige (sandbox/prueba).
   */
  private checkPendingPayment(): void {
    const storedOrderId = this.localStorageService.getItem('currentOrderId');
    if (!storedOrderId) return;

    const orderId = Number(storedOrderId);
    console.log('[App] Verificando pago pendiente para orden #', orderId);

    this.paymentService.verifyPayment(orderId).subscribe({
      next: (response) => {
        if (response.orderStatus === 'Pagado' || response.paymentStatus === 'approved') {
          console.log('[App] ✅ Orden #', orderId, 'confirmada como PAGADA');
          this.localStorageService.removeItem('currentOrderId');
        } else {
          console.log('[App] Orden #', orderId, 'estado:', response.orderStatus);
        }
      },
      error: () => {
        // Fallo silencioso — no se bloquea la app
      }
    });
  }
}

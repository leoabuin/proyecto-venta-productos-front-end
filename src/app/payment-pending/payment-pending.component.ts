import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';
import { PaymentService, MercadoPagoPaymentResponse } from '../service/payment.service';

@Component({
  selector: 'app-payment-pending',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './payment-pending.component.html',
  styleUrl: './payment-pending.component.scss'
})
export class PaymentPendingComponent implements OnInit {
  orderId: number | null = null;
  paymentStatus: string | null = null;
  isCheckingStatus: boolean = false;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    // Obtener el orderId del localStorage
    const storedOrderId = this.localStorageService.getItem('currentOrderId');
    if (storedOrderId) {
      this.orderId = Number(storedOrderId);
    }
  }

  checkPaymentStatus(): void {
    if (!this.orderId) {
      return;
    }

    this.isCheckingStatus = true;
    this.paymentService.verifyPayment(this.orderId).subscribe({
      next: (response: MercadoPagoPaymentResponse) => {
        console.log('Estado de pago:', response);
        this.paymentStatus = response.paymentStatus;
        this.isCheckingStatus = false;

        // Si el pago fue aprobado, redirigir a success
        if (response.paymentStatus === 'approved') {
          this.router.navigate(['/payment/success']);
        }
        // Si fue rechazado, redirigir a failure
        else if (response.paymentStatus === 'rejected') {
          this.router.navigate(['/payment/failure']);
        }
      },
      error: (error: any) => {
        console.error('Error al verificar pago:', error);
        this.isCheckingStatus = false;
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

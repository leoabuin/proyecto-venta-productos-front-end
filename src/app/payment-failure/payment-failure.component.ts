import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';

@Component({
  selector: 'app-payment-failure',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './payment-failure.component.html',
  styleUrl: './payment-failure.component.scss'
})
export class PaymentFailureComponent implements OnInit {
  orderId: number | null = null;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    // Obtener el orderId del localStorage
    const storedOrderId = this.localStorageService.getItem('currentOrderId');
    if (storedOrderId) {
      this.orderId = Number(storedOrderId);
    }
  }

  retryPayment(): void {
    if (this.orderId) {
      // Redirigir de vuelta al carrito con el orderId
      this.router.navigate(['/shopping-cart']);
    } else {
      this.router.navigate(['/shopping-cart']);
    }
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

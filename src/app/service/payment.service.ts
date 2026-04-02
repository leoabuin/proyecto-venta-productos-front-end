import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface MercadoPagoPaymentResponse {
  paymentStatus: string;   // Estado del pago en Mercado Pago (approved, rejected, pending, in_process)
  orderStatus: string;     // Estado actualizado en BD (Pagado, Rechazado, Pago Pendiente)
  paymentId?: string;
  orderId?: number;
  previousStatus?: string;
  message?: string;
}

interface CreatePreferenceRequest {
  orderId: number;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
  }>;
}

interface CreatePreferenceResponse {
  init_point?: string;
  sandbox_init_point?: string;
  preference_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Crea una preferencia de pago en Mercado Pago
   * @param orderId ID de la orden
   * @param items Array de items del carrito
   * @returns Observable con init_point para redirigir a MP
   */
  createPaymentPreference(orderId: number, items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
  }>): Observable<CreatePreferenceResponse> {
    const payload: CreatePreferenceRequest = {
      orderId,
      items
    };
    return this.http.post<CreatePreferenceResponse>(
      `${this.apiUrl}/payment/create-preference`,
      payload,
      { withCredentials: true }
    );
  }

  /**
   * Verifica el estado del pago con Mercado Pago
   * @param orderId ID de la orden
   * @returns Observable con el estado del pago
   */
  verifyPayment(orderId: number): Observable<MercadoPagoPaymentResponse> {
    return this.http.post<MercadoPagoPaymentResponse>(
      `${this.apiUrl}/payment/verify-payment`,
      { order_id: orderId },
      { withCredentials: true }
    );
  }

  /**
   * Marca la orden como pagada (alternativa, usualmente el webhook se encarga)
   * @param orderId ID de la orden
   * @returns Observable con la respuesta
   */
  markOrderAsPaid(orderId: number): Observable<MercadoPagoPaymentResponse> {
    return this.http.post<MercadoPagoPaymentResponse>(
      `${this.apiUrl}/payment/mark-paid`,
      { orderId },
      { withCredentials: true }
    );
  }
}

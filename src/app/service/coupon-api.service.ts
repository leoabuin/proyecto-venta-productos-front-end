import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class CouponApiService {
  private baseUrl = `${environment.apiUrl}/coupons`;

  constructor(private http: HttpClient) {}

  /** Obtiene todos los cupones (solo Empleado/Admin) */
  public getAll(): Observable<any> {
    return this.http.get<any>(this.baseUrl, { withCredentials: true });
  }

  /** Valida un cupón por código (cualquier usuario autenticado) */
  public validate(code: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/validate/${encodeURIComponent(code)}`, { withCredentials: true });
  }

  /** Crea un cupón nuevo (solo Empleado/Admin) */
  public create(coupon: { code: string; discountPercentage: number; expirationDate: string }): Observable<any> {
    return this.http.post<any>(this.baseUrl, coupon, { withCredentials: true });
  }

  /** Actualiza un cupón (solo Empleado/Admin) */
  public update(id: number, coupon: Partial<{ code: string; discountPercentage: number; expirationDate: string }>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, coupon, { withCredentials: true });
  }

  /** Elimina un cupón (solo Empleado/Admin) */
  public delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}

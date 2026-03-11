
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environment";

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {
  private urlOrderApi = `${environment.apiUrl}/orders`;
  
  
  constructor(private http: HttpClient) { }

  public getAllOrders(): Observable<any> {
    return this.http.get<any>(this.urlOrderApi, { withCredentials: true })
  }

  public placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.urlOrderApi, orderData, { withCredentials: true });
  }

  public findOrderbyUser(userId: number): Observable<any>{
    return this.http.get<any>(`${this.urlOrderApi}/${userId}`, { withCredentials: true })
  }

  public cancelOrder(orderId: number): Observable<any>{
    return this.http.post<any>(`${this.urlOrderApi}/${orderId}`, {}, { withCredentials: true })
  }
}

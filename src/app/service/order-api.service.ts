
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {
  private urlOrderApi = 'http://localhost:3000/api/orders';
  
  
  constructor(private http: HttpClient) { }

  public placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.urlOrderApi, orderData)
  }

  public findOrderbyUser(userId: number): Observable<any>{
    return this.http.get<any>(`${this.urlOrderApi}/${userId}`)
  }

  public cancelOrder(orderId: number): Observable<any>{
    return this.http.post<any>(`${this.urlOrderApi}/${orderId}`, {})
  }
}

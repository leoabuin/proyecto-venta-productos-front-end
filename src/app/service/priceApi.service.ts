import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
  })
  export class ApiPriceService {
  
    private urlPriceApi = 'http://localhost:3000/api/products';
  
  
    constructor(private http: HttpClient) { }

    addPriceToProduct(idProduct: number, priceData: any): Observable<any> {
        return this.http.post(`${this.urlPriceApi}/${idProduct}/prices`, priceData,{ withCredentials: true });
    }
  

  }
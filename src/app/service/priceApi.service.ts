import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environment";


@Injectable({
    providedIn: 'root'
  })
  export class ApiPriceService {
  
    private urlPriceApi = `${environment.apiUrl}/products`;
  
  
    constructor(private http: HttpClient) { }

    addPriceToProduct(idProduct: number, priceData: any): Observable<any> {
        return this.http.post(`${this.urlPriceApi}/${idProduct}/prices`, priceData,{ withCredentials: true });
    }
  

  }
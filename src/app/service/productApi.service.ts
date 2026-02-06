import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ApiProductService {

  private urlProductApi = 'http://localhost:3000/api/products';


  constructor(private http: HttpClient) { }

  public getProductsData(): Observable<any> {
    return this.http.get<any>(this.urlProductApi, { withCredentials: true })
  }

  public createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.urlProductApi, productData)
  }

  public getProductbyId(id: string): Observable<any> {
    return this.http.get<any>(`${this.urlProductApi}/${id}`)
  }

  public updateProduct(id: number, data: { isOffer: boolean }): Observable<any> {
    return this.http.patch(`${this.urlProductApi}/${id}`, data);
  }

  public updateDiscontinuedStatus(id: number, isContinued: boolean): Observable<any> {
  // Envolvemos el dato en un objeto 'input' si es lo que el middleware busca
  return this.http.patch(`${this.urlProductApi}/${id}`, { isContinued });
  }
  
  public updateOnlyOffer(id: number, isOffer: boolean): Observable<any> {
    return this.http.patch(`${this.urlProductApi}/${id}/toggle-offer`, { isOffer });
  }
}
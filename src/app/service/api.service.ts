import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urlBrandApi = 'http://localhost:3000/api/brands';


  constructor(private http: HttpClient) { }

  public getData(): Observable<any>{
    return this.http.get<any>(this.urlBrandApi)
  }

  public createBrand(brandData: any): Observable<any> {
    return this.http.post<any>(this.urlBrandApi, brandData);
  }

  public deleteBrand(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlBrandApi}/${id}`);
  }

  public updateBrand(id: number, brandData: any): Observable<any> {
    return this.http.put(`${this.urlBrandApi}/${id}`, brandData);
  }
}

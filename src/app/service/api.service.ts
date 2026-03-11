import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urlBrandApi = `${environment.apiUrl}/brands`;


  constructor(private http: HttpClient) { }

  public getData(): Observable<any>{
    return this.http.get<any>(this.urlBrandApi, { withCredentials: true })
  }

  public createBrand(brandData: any): Observable<any> {
    return this.http.post<any>(this.urlBrandApi, brandData, { withCredentials: true });
  }

  public deleteBrand(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlBrandApi}/${id}`, { withCredentials: true });
  }

  public updateBrand(id: number, brandData: any): Observable<any> {
    return this.http.put(`${this.urlBrandApi}/${id}`, brandData, { withCredentials: true });
  }

  public getBrandbyId(id:string): Observable<any>{
    return this.http.get<any>(`${this.urlBrandApi}/${id}`, { withCredentials: true })
  }

}

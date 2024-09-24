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
}

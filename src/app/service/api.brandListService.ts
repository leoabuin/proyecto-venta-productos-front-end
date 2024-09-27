import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiBrandListService {
  private apiUrl = 'http://localhost:3000/api/brands';

  constructor(private http: HttpClient) {}

  // Método para obtener los datos de la API
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
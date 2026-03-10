import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({ providedIn: 'root' })
export class ApiGenderService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/genders`;

  getAll(): Observable<any> {
    return this.http.get<any>(this.url);
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiGenderService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/api/genders';

  getAll(): Observable<any> {
    return this.http.get<any>(this.url);
  }
}
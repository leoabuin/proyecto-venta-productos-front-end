import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private brandApiUrl = 'http://localhost:3000/api/brands';
  private categoryApiUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) {}

  getBrands(): Observable<string[]> {
    return this.http.get<string[]>(this.brandApiUrl);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.categoryApiUrl);
  }
}
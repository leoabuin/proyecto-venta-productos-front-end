import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
  })
  export class ApiCategoryService {
  
    private urlCategoryApi = 'http://localhost:3000/api/categories';
  
  
    constructor(private http: HttpClient) { }
  
    public getCategoriesData(): Observable<any>{
      return this.http.get<any>(this.urlCategoryApi)
    }
  
    public createCategory(categoryData: any): Observable<any> {
      return this.http.post<any>(this.urlCategoryApi, categoryData);
    }
  
    public deleteCategory(id: number): Observable<any> {
      return this.http.delete<any>(`${this.urlCategoryApi}/${id}`);
    }
  }
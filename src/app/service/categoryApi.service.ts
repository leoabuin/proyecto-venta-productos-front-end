import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "../update-category/update-category.component.js";


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

    public getCategoryById(id: number): Observable<any> {
      return this.http.get<any>(`${this.urlCategoryApi}/${id}`);
  }


    public updateCategory(id: number,categoryUpdated: Partial<Category>): Observable<any> {
      return this.http.put<any>(`${this.urlCategoryApi}/${id}`, categoryUpdated)
    }
  }
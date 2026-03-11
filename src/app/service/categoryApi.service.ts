import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "../update-category/update-category.component.js";
import { environment } from "../environment";


@Injectable({
    providedIn: 'root'
  })
  export class ApiCategoryService {
  
    private urlCategoryApi = `${environment.apiUrl}/categories`;
  
  
    constructor(private http: HttpClient) { }
  
    public getCategoriesData(): Observable<any>{
      return this.http.get<any>(this.urlCategoryApi, { withCredentials: true })
    }
  
    public createCategory(categoryData: any): Observable<any> {
      return this.http.post<any>(this.urlCategoryApi, categoryData, { withCredentials: true });
    }
  
    public deleteCategory(id: number): Observable<any> {
      return this.http.delete<any>(`${this.urlCategoryApi}/${id}`, { withCredentials: true });
    }

    public getCategoryById(id: number): Observable<any> {
      return this.http.get<any>(`${this.urlCategoryApi}/${id}`, { withCredentials: true });
    }


    public updateCategory(id: number,categoryUpdated: Partial<Category>): Observable<any> {
      return this.http.put<any>(`${this.urlCategoryApi}/${id}`, categoryUpdated, { withCredentials: true })
    }
  }
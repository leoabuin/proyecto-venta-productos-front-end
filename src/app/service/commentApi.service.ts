import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
  })
  export class ApiCommentService {
  
    private urlCommentApi = 'http://localhost:3000/api/comments';
  
  
    constructor(private http: HttpClient) { }
  
    public findCommentsByProduct(productId: string): Observable<any> {
        return this.http.get<any>(`${this.urlCommentApi}/${productId}`, { withCredentials: true });
      }

      public add(commentData: any): Observable<any> {
        return this.http.post<any>(this.urlCommentApi, commentData, { withCredentials: true });
      }

  }
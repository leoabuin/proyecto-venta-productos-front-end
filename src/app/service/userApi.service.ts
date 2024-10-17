import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
  })
  export class ApiUserService {
  
    private urlUserApi = 'http://localhost:3000/api/users';
  
  
    constructor(private http: HttpClient) { }
  
    public getUsersData(): Observable<any>{
      return this.http.get<any>(this.urlUserApi)
    }

    public createUser(userData: any): Observable<any> {
        return this.http.post<any>(this.urlUserApi, userData);
      }
  }
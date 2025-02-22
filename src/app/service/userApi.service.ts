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
    public getUserbyId(id:number): Observable<any> {
      return this.http.get<any>(`${this.urlUserApi}/${id}`);
  }

    public createUser(userData: any): Observable<any> {
        return this.http.post<any>(this.urlUserApi, userData);
    }

    public logInUser(userData:any): Observable<any>{
      return this.http.post<any>(`${this.urlUserApi}/logIn`, userData, { withCredentials: true });
    }
    public logOut(): Observable<any> {
      return this.http.post<any>(`${this.urlUserApi}/logOut`, {}, { withCredentials: true });
    }
    public update(id:number,userData:any):Observable<any>{
      return this.http.patch<any>(`${this.urlUserApi}/${id}`,userData)
    }
    
  }
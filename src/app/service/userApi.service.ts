import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environment";

@Injectable({
    providedIn: 'root'
  })
  export class ApiUserService {
  
    private urlUserApi = `${environment.apiUrl}/users`;
  
  
    constructor(private http: HttpClient) { }
  
    public getUsersData(): Observable<any>{
      return this.http.get<any>(this.urlUserApi, { withCredentials: true })
    }
    public getUserbyId(id:number): Observable<any> {
      return this.http.get<any>(`${this.urlUserApi}/${id}`, { withCredentials: true });
    }

    public createUser(userData: any): Observable<any> {
        return this.http.post<any>(this.urlUserApi, userData, { withCredentials: true });
    }

    // --- FAVORITES ENDPOINTS ---
    public getFavorites(): Observable<any> {
        return this.http.get<any>(`${this.urlUserApi}/favorites`, { withCredentials: true });
    }

    public addFavorite(productId: number): Observable<any> {
        return this.http.post<any>(`${this.urlUserApi}/favorites/${productId}`, {}, { withCredentials: true });
    }

    public removeFavorite(productId: number): Observable<any> {
        return this.http.delete<any>(`${this.urlUserApi}/favorites/${productId}`, { withCredentials: true });
    }
    // ---------------------------

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
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
  })
  export class ApiDistributorService {
  
    private urlDistributorApi = 'http://localhost:3000/api/distributors';
  
  
    constructor(private http: HttpClient) { }
  
    public getDistributorsData(): Observable<any>{
      return this.http.get<any>(this.urlDistributorApi)
    }

  }
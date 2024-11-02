import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Distributor } from "../update-distributor/update-distributor.component";


@Injectable({
    providedIn: 'root'
  })
  export class ApiDistributorService {
    
    private urlDistributorApi = 'http://localhost:3000/api/distributors';
    
  
    constructor(private http: HttpClient) { }
  
    public createDistributor(distributorData: any): Observable<any> {
      return this.http.post<any>(this.urlDistributorApi, distributorData);
    }
  
    public getDistributorsData(): Observable<any>{
      return this.http.get<any>(this.urlDistributorApi)
    }

    getDistributorById(id: number): Observable<any>{
      return this.http.get<any>(`${this.urlDistributorApi}/${id}`);
    }
  
    public updateDistributor(id: number,distributorUpdated: Partial<Distributor>): Observable<any> {
      return this.http.put<any>(`${this.urlDistributorApi}/${id}`, distributorUpdated)
    }

    public deleteDistributor(id: number): Observable<any> {
      return this.http.delete<any>(`${this.urlDistributorApi}/${id}`);
    }

  }
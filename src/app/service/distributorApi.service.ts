import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Distributor } from "../update-distributor/update-distributor.component";
import { environment } from "../environment";


@Injectable({
    providedIn: 'root'
  })
  export class ApiDistributorService {
    
    private urlDistributorApi = `${environment.apiUrl}/distributors`;
    
  
    constructor(private http: HttpClient) { }
  
    public createDistributor(distributorData: any): Observable<any> {
      return this.http.post<any>(this.urlDistributorApi, distributorData);
    }
  
    public getDistributorsData(): Observable<any>{
      return this.http.get<any>(this.urlDistributorApi, { withCredentials: true })
    }

    getDistributorById(id: number): Observable<any>{
      return this.http.get<any>(`${this.urlDistributorApi}/${id}`, { withCredentials: true });
    }
  
    public updateDistributor(id: number,distributorUpdated: Partial<Distributor>): Observable<any> {
      return this.http.put<any>(`${this.urlDistributorApi}/${id}`, distributorUpdated, { withCredentials: true })
    }

    public deleteDistributor(id: number): Observable<any> {
      return this.http.delete<any>(`${this.urlDistributorApi}/${id}`, { withCredentials: true });
    }

  }
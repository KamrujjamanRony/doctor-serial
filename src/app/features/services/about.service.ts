import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private http: HttpClient) {}

  
  getAllAbout(): Observable<any[]> {
    return this.http.get<any[]>(environment.AboutApi);
  }

  getAbout(id: any): Observable<any>{
    return this.http.get<any>(`${environment.AboutApi}/GetAboutUsById?id=${id}`);
  }

  updateAbout(id: any, updateAboutRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.AboutApi}/EditAboutUs/${id}`, updateAboutRequest);
  }
}

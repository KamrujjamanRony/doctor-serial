import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) {}

  
  getAllContact(): Observable<any[]> {
    return this.http.get<any[]>(environment.ContactApi);
  }

  getContact(id: any): Observable<any>{
    return this.http.get<any>(`${environment.ContactApi}/GetAddressById?id=${id}`);
  }

  updateContact(id: any, updateAddressRequest: any | FormData): Observable<any>{
    return this.http.put<any>(`${environment.ContactApi}/EditAddress/${id}`, updateAddressRequest);
  }
}

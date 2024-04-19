import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  constructor(private http: HttpClient) { }

  registerUser(role: any, model: any | FormData): Observable<void>{
    return this.http.post<void>(`${environment.authApi}?role=${role}`, model)
  }

  loginUser(model: any): Observable<void>{
    return this.http.post<void>(`${environment.authApi}/Login`, model)
  }
}

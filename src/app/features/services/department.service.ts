import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { } 

  getDepartments(): Promise<any[]> {
    return lastValueFrom(
      this.http.get<any[]>(environment.DepartmentApi).pipe(
        map(departments => departments.filter(data => data.companyID === environment.hospitalCode))
      ),
    )
  }

  addDepartment(model: any | FormData): Promise<any> {
    return lastValueFrom(
      this.http.post<void>(environment.DepartmentApi, model),
    )
  }

  getDepartment(id: any): Promise<any> {
    return lastValueFrom(
      this.http.get<void>(`${environment.DepartmentApi}/${id}`),
    )
  }

  updateDepartment(id: any, updateData: any): Promise<any> {
    return lastValueFrom(
      this.http.put<any>(`${environment.DepartmentApi}/${id}`, updateData),
    )
  }

  deleteDepartment(id: any): Promise<any> {
    return lastValueFrom(
      this.http.delete<void>(`${environment.DepartmentApi}/${id}`),
    )
  }
}

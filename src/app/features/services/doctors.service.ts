import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {

  private doctorsUrl = 'assets/data/doctors.json';

  constructor(private http: HttpClient) { } 

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(this.doctorsUrl);
  }

  filterDoctorsByDepartment(department: string): Observable<any[]> {
    // Filter the array of doctors by department
    return this.getDoctors().pipe(
      map(doctors => doctors.filter(doctor => doctor.department.toLowerCase() === department.toLowerCase()))
    );
  }

  addDoctor(model: any): Observable<void>{
    return this.http.post<void>(`${environment.DoctorApi}`, model)
  }
  
  getAllDoctors(): Observable<any[]>{
    return this.http.get<any[]>(`${environment.DoctorApi}`)
  }

  getDoctor(id: any): Observable<any>{
    return this.http.get<any>(`${environment.DoctorApi}/${id}`)
  }

  updateDoctor(id: any, updateDoctorRequest: any): Observable<any>{
    return this.http.put<any>(`${environment.DoctorApi}/${id}`, updateDoctorRequest);
  }

  deleteDoctor(id: any): Observable<any>{
    return this.http.delete<any>(`${environment.DoctorApi}/${id}`);
  }
}

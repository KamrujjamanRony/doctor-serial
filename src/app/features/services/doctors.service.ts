import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {

  queryClient = injectQueryClient();
  http = inject(HttpClient);

  

  constructor() { } 

  getDoctors(): Promise<any[]> {
    return lastValueFrom(
      this.http.get<any[]>(environment.DoctorApi).pipe(
        map(departments => departments.filter(data => data.companyID == environment.hospitalCode))
      ),
    )
  }

  doctorsQuery = injectQuery(() => ({
    queryKey: ['doctors'],
    queryFn: () => this.getDoctors(),
  }));

  addDoctor(model: any | FormData): Promise<any> {
    return lastValueFrom(
      this.http.post<void>(environment.DoctorApi, model),
    )
  }

  getDoctor(id: any): any{
    const doctors = this.queryClient.getQueryData(['doctors']) as any[];
    return doctors?.find((d) => d.id == id);
  }

  updateDoctor(id: any, updateData: any): Promise<any> {
    return lastValueFrom(
      this.http.put<any>(`${environment.DoctorApi}/${id}`, updateData),
    )
  }

  deleteDoctor(id: any): Promise<any> {
    return lastValueFrom(
      this.http.delete<void>(`${environment.DoctorApi}/${id}`),
    )
  }

  getDoctorById(id: any): any{
    const doctors = this.queryClient.getQueryData(['doctors']) as any[];
    const selected = doctors?.find((d) => d.id == id);
    return selected?.drName;
  }

  async filterDoctorsByDepartment(departmentId: string): Promise<any[]> {
    try {
      // Wait for the query to finish and get the data
      await this.doctorsQuery.refetch();
      // Access the data
      const doctors = this.queryClient.getQueryData(['doctors']) as any[];
      // Filter the doctors based on departmentId
      return doctors?.filter((d) => d.departmentId == departmentId) || [];
    } catch (error) {
      console.error("Error fetching doctors data:", error);
      return []; // Return an empty array in case of an error
    }
  }

  // filterDoctorsByDepartment(departmentId: string): any[] {
  //   const doctors = this.queryClient.getQueryData(['doctors']) as any[];
  //   console.log(doctors)
  //   return doctors?.filter((d) => d.departmentId == departmentId);
  // }


  // getDoctor(id: any): Observable<any>{
  //   return this.http.get<any>(`${environment.DoctorApi}/${id}`)
  // }
  
}

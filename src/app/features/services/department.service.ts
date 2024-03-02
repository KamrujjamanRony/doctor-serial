import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  queryClient = injectQueryClient();
  http = inject(HttpClient);

  constructor() { } 

  getDepartments(): Promise<any[]> {
    return lastValueFrom(
      this.http.get<any[]>(environment.DepartmentApi).pipe(
        map(departments => departments.filter(data => data.companyID == environment.hospitalCode))
      ),
    )
  }

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.getDepartments(),
  }));

  addDepartment(model: any | FormData): Promise<any> {
    return lastValueFrom(
      this.http.post<void>(environment.DepartmentApi, model),
    )
  }

  getDepartment(id: any): any{
    const departments = this.queryClient.getQueryData(['departments']) as any[];
    return departments?.find((d) => d.id == id);
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

  getDepartmentById(id: any): any{
    const departments = this.queryClient.getQueryData(['departments']) as any[];
    const selected = departments?.find((d) => d.id == id);
    return selected?.departmentName;
  }
}

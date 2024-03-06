import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  queryClient = injectQueryClient();
  http = inject(HttpClient);

  apiClient = axios.create({
    baseURL: environment.rootApi,
    headers: {
      'Content-Type' : 'application/json',
      'Accept' : 'application/json'
    }
  })

  constructor() { } 

  async getDepartments(){
    try {
      const response = await this.apiClient.get('/department');
      return response;
    } catch (error) {
      console.log(error);
      return {};
    }
  } 

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.getDepartments(),
  }));

  async addDepartment(model: any | FormData){
    try {
      const response = await this.apiClient.post('/department', model);
      return response;
    } catch (error) {
      console.log(error);
      return {};
    }
  } 

  getDepartment(id: any): any{
    const departments = this.queryClient.getQueryData(['departments']) as any[];
    return departments?.find((d) => d.id == id);
  }

  async updateDepartment(id: any, updateData: any){
    try {
      const response = await this.apiClient.post(`/department/${id}`, updateData);
      return response;
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  async deleteDepartment(id: any){
    try {
      const response = await this.apiClient.delete(`/department/${id}`);
      return response;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  // getDepartments(): Promise<any[]> {
  //   return lastValueFrom(
  //     this.http.get<any[]>(environment.DepartmentApi).pipe(
  //       map(departments => departments.filter(data => data.companyID == environment.hospitalCode))
  //     ),
  //   )
  // }
  
  // addDepartment(model: any | FormData): Promise<any> {
  //   return lastValueFrom(
  //     this.http.post<void>(environment.DepartmentApi, model),
  //   )
  // }

  // updateDepartment(id: any, updateData: any): Promise<any> {
  //   return lastValueFrom(
  //     this.http.put<any>(`${environment.DepartmentApi}/${id}`, updateData),
  //   )
  // }

  // deleteDepartment(id: any): Promise<any> {
  //   return lastValueFrom(
  //     this.http.delete<void>(`${environment.DepartmentApi}/${id}`),
  //   )
  // }

  getDepartmentById(id: any): any{
    const departments = this.queryClient.getQueryData(['departments']) as any[];
    const selected = departments?.find((d) => d.id == id);
    return selected?.departmentName;
  }
}

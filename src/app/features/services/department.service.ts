import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  queryClient = injectQueryClient();

  apiClient = axios.create({
    baseURL: environment.DepartmentApi,
    // headers: {
    //   'Content-Type' : 'application/json',
    //   'Accept' : 'application/json'
    // }
  })

  constructor() { } 

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.getDepartments(),
  }));

  async getDepartments(): Promise<any[]> {
    try {
      const response = await this.apiClient.get<any[]>('/');
      const filteredDepartments = response.data.filter(data => data.companyID == environment.hospitalCode);
      return filteredDepartments;
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  async addDepartment(model: any | FormData): Promise<any>{
    try {
      const response = await this.apiClient.post('/', model);
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  } 
  
  getDepartment(id: any): any{
    const departments = this.queryClient.getQueryData(['departments']) as any[];
    return departments?.find((d) => d.id == id);
  }

  async updateDepartment(id: any, updateData: any): Promise<any>{
    try {
      const response = await this.apiClient.put(`/EditDepartment/${id}`, updateData);
      return response;
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  };

  async deleteDepartment(id: any): Promise<any>{
    try {
      const response = await this.apiClient.delete(`/DeleteDepartment?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  getDepartmentById(id: any): any{
    const departments = this.queryClient.getQueryData(['departments']) as any[];
    const selected = departments?.find((d) => d.id == id);
    return selected?.departmentName;
  }

  getDepartmentByDoctorId(id: any): any{
    const departments = this.queryClient.getQueryData(['departments']) as any[];
    const selected = departments?.find((d) => d.id == id);
    return selected;
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
}

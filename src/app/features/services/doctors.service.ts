import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {

  queryClient = injectQueryClient();

  apiClient = axios.create({
    baseURL: environment.rootApi,
    headers: {
      'Content-Type' : 'application/json',
      'Accept' : 'application/json'
    }
  })

  doctorsQuery = injectQuery(() => ({
    queryKey: ['doctors'],
    queryFn: () => this.getDoctors(),
  }));

  

  constructor() { } 

  async getDoctors(): Promise<any[]> {
    try {
      const response = await this.apiClient.get<any[]>('/doctor');
      const filteredDoctors = response.data.filter(data => data.companyID == environment.hospitalCode);
      return filteredDoctors;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  async addDoctor(model: any | FormData): Promise<any>{
    try {
      const response = await this.apiClient.post('/doctor', model);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  async updateDoctor(id: any, updateData: any): Promise<any>{
    try {
      const response = await this.apiClient.patch(`/doctor/${id}`, updateData);
      return response;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  };

  async deleteDoctor(id: any): Promise<any>{
    try {
      const response = await this.apiClient.delete(`/doctor/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  getDoctor(id: any): any{
    const doctors = this.queryClient.getQueryData(['doctors']) as any[];
    return doctors?.find((d) => d.id == id);
  }

  getDoctorById(id: any): any{
    const doctors = this.queryClient.getQueryData(['doctors']) as any[];
    const selected = doctors?.find((d) => d.id == id);
    return selected;
  }

  async filterDoctorsByDepartment(departmentId: any): Promise<any[]> {
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
  
}

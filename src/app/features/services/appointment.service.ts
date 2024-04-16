import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  queryClient = injectQueryClient();

  apiClient = axios.create({
    baseURL: environment.appointmentApi,
    // headers: {
    //   'Content-Type' : 'application/json',
    //   'Accept' : 'application/json'
    // }
  })

  constructor() { } 

  query = injectQuery(() => ({
    queryKey: ['appointments'],
    queryFn: () => this.getAppointments(),
  }));

  getAppointment(id: any): any{
    const Appointments = this.queryClient.getQueryData(['appointments']) as any[];
    return Appointments?.find((d) => d.id == id);
  }

  async getAppointments(): Promise<any[]> {
    try {
      const response = await this.apiClient.get<any[]>('/');
      const filteredAppointments = response.data.filter(data => data.companyID == environment.hospitalCode);
      return filteredAppointments;
    } catch (error) {
      console.error('Error fetching Appointments:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  async addAppointment(model: any | FormData): Promise<any>{
    try {
      const response = await this.apiClient.post('/', model);
      return response.data;
    } catch (error) {
      console.error('Error fetching Appointments:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  async updateAppointment(id: any, updateData: any): Promise<any>{
    try {
      const response = await this.apiClient.put(`/EditAppointment/${id}`, updateData);
      return response;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  };

  async deleteAppointment(id: any): Promise<any>{
    try {
      const response = await this.apiClient.delete(`/DeleteAppointment?id=${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      // Optionally rethrow the error or return a default value
      throw error;
    }
  }

  getAppointmentById(id: any): any{
    const Appointments = this.queryClient.getQueryData(['appointments']) as any[];
    const selected = Appointments?.find((d) => d.id == id);
    return selected.AppointmentName;
  }
  

  // getAppointments(): Promise<any[]> {
  //   return lastValueFrom(
  //     this.http.get<any[]>(environment.appointmentApi).pipe(
  //       map(appointments => appointments.filter(data => data.companyID == environment.hospitalCode))
  //     ),
  //   )
  // } 

  // addAppointment(model: any | FormData): Promise<any> {
  //   return lastValueFrom(
  //     this.http.post<void>(environment.appointmentApi, model),
  //   )
  // }

  // updateAppointment(id: any, updateData: any): Promise<any> {
  //   return lastValueFrom(
  //     this.http.put<any>(`${environment.appointmentApi}/${id}`, updateData),
  //   )
  // }

  // deleteAppointment(id: any): Promise<any> {
  //   return lastValueFrom(
  //     this.http.delete<void>(`${environment.appointmentApi}/${id}`),
  //   )
  // }
}

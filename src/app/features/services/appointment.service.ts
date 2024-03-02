import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { environment } from '../../../environments/environments';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  queryClient = injectQueryClient();
  http = inject(HttpClient);

  constructor() { } 

  getAppointments(): Promise<any[]> {
    return lastValueFrom(
      this.http.get<any[]>(environment.appointmentApi).pipe(
        map(appointments => appointments.filter(data => data.companyID == environment.hospitalCode))
      ),
    )
  }

  query = injectQuery(() => ({
    queryKey: ['appointments'],
    queryFn: () => this.getAppointments(),
  }));

  addAppointment(model: any | FormData): Promise<any> {
    return lastValueFrom(
      this.http.post<void>(environment.appointmentApi, model),
    )
  }

  getAppointment(id: any): any{
    const Appointments = this.queryClient.getQueryData(['appointments']) as any[];
    return Appointments?.find((d) => d.id == id);
  }

  updateAppointment(id: any, updateData: any): Promise<any> {
    return lastValueFrom(
      this.http.put<any>(`${environment.appointmentApi}/${id}`, updateData),
    )
  }

  deleteAppointment(id: any): Promise<any> {
    return lastValueFrom(
      this.http.delete<void>(`${environment.appointmentApi}/${id}`),
    )
  }

  getAppointmentById(id: any): any{
    const Appointments = this.queryClient.getQueryData(['appointments']) as any[];
    const selected = Appointments?.find((d) => d.id == id);
    return selected.AppointmentName;
  }
}

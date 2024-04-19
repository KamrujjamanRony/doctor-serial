import { Component, inject } from '@angular/core';
import { CoverComponent } from '../../components/shared/cover/cover.component';
import { AppointmentModalComponent } from '../../components/shared/modal/appointment-modal/appointment-modal.component';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../features/services/appointment.service';
import { DepartmentService } from '../../features/services/department.service';
import { DoctorsService } from '../../features/services/doctors.service';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../features/services/auth.service';
import { NavbarComponent } from "../../components/shared/navbar/navbar.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-my-appointments',
    standalone: true,
    templateUrl: './my-appointments.component.html',
    styleUrl: './my-appointments.component.css',
    imports: [CoverComponent, AppointmentModalComponent, FormsModule, NavbarComponent]
})
export class MyAppointmentsComponent {
  appointmentService = inject(AppointmentService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  authService = inject(AuthService);
  router = inject(Router);
  queryClient = injectQueryClient();
  emptyImg: any;
  selectedId: any;
  addAppointmentModal: boolean = false;
  editAppointmentModal: boolean = false;
  private appointmentSubscription?: Subscription;
  searchQuery: string = '';
  
  selectedDoctor: string = '';
  doctorsWithAppointments: any = [];
  user: any;

  constructor(){
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.getDoctorsWithAppointments();
  }

  redirectToHome(): void {
    this.router.navigateByUrl('/');
  }

  async getDoctorsWithAppointments(): Promise<void> {
    const appointments = await this.appointmentService.getAppointments();
    const doctorIds = appointments.filter(appointment => appointment.username == this.user.username).map(appointment => appointment.drCode);
    this.doctorsWithAppointments = (await this.doctorsService.getDoctors()).filter(doctor => doctorIds.includes(doctor.id));
  }

  appointmentQuery = injectQuery(() => ({
    queryKey: ['appointments'],
    queryFn: () => this.appointmentService.getAppointments(),
  }));

  appointmentMutation = injectMutation((client) => ({
    mutationFn: (id: any) => this.appointmentService.deleteAppointment(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['appointments'] })
    },
  }));

  filterAppointmentsByUser(appointments: any) {
    if (!this.user.username) {
      return appointments; // If search query is empty, return all appointments
    }
    const selectedAppointment = appointments.filter((appointment: { username: any; }) =>
      appointment.username == this.user.username
    );
    return selectedAppointment;
  }

  filterAppointmentsBySearch(appointments: any) {
    if (!this.searchQuery.trim()) {
      return appointments; // If search query is empty, return all appointments
    }
    const selectedAppointment = appointments.filter((appointment: { drCode: any; }) =>
      this.doctorsService.getDoctorById(appointment?.drCode)?.drName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    return selectedAppointment;
  }

  filterAppointmentsByDoctor(appointments: any): any {
    if (this.selectedDoctor == "") {
      return appointments; // If search query is empty, return all appointments
    }

    const selectedAppointment = appointments.filter((appointment: { drCode: any; }) =>
      appointment && appointment.drCode == this.selectedDoctor
    );
    return selectedAppointment;
  }
  
  
  
  

  onDelete(id: any) {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.appointmentMutation.mutate(id);
    }
  }

  transform(value: any, args?: any): any {
    if (!value) return null;

    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, 'dd/MM/yyyy');
  }

  openEditAppointmentModal(id: any) {
    this.selectedId = id;
    this.editAppointmentModal = true;
  }

  closeEditAppointmentModal() {
    this.editAppointmentModal = false;
  }

  // Function to print the page
  isPrinting: boolean = false;
  printPage() {
    this.isPrinting = true;
    setTimeout(() => {
      window.print();
      // Reset the printing state after printing is complete
      setTimeout(() => {
        this.isPrinting = false;
      }, 1000); // Adjust the delay as needed
    }, 100); // Adjust the delay as needed
  }

  ngOnDestroy(): void {
    this.appointmentSubscription?.unsubscribe();
  }

}

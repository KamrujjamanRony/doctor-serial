import { Component, inject } from '@angular/core';
import { AppointmentService } from '../../features/services/appointment.service';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { DatePipe } from '@angular/common';
import { DepartmentService } from '../../features/services/department.service';
import { DoctorsService } from '../../features/services/doctors.service';
import { AppointmentModalComponent } from '../../components/shared/modal/appointment-modal/appointment-modal.component';

@Component({
    selector: 'app-all-appointment',
    standalone: true,
    templateUrl: './all-appointment.component.html',
    styleUrl: './all-appointment.component.css',
    imports: [CoverComponent, AppointmentModalComponent]
})
export class AllAppointmentComponent {
  appointmentService = inject(AppointmentService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  queryClient = injectQueryClient();
  emptyImg: any;
  selectedId: any;
  addAppointmentModal: boolean = false;
  editAppointmentModal: boolean = false;
  private appointmentSubscription?: Subscription;

  constructor() {}

  ngOnInit(): void {}

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

  ngOnDestroy(): void {
    this.appointmentSubscription?.unsubscribe();
  }
}

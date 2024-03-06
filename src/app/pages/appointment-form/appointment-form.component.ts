import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environments';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { format, isBefore } from 'date-fns';
import { ToastService } from '../../features/services/toast.service';
import { AppointmentService } from '../../features/services/appointment.service';
import { DepartmentService } from '../../features/services/department.service';
import { DoctorsService } from '../../features/services/doctors.service';
import { CommonModule } from '@angular/common';
import { ReactIconComponent } from '../../components/shared/react-icon/react-icon.component';
import { ConfirmModalComponent } from "../../components/shared/confirm-modal/confirm-modal.component";

@Component({
    selector: 'app-appointment-form',
    standalone: true,
    templateUrl: './appointment-form.component.html',
    styleUrl: './appointment-form.component.css',
    imports: [CommonModule, ReactiveFormsModule, ReactIconComponent, ConfirmModalComponent]
})
export class AppointmentFormComponent {
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  appointmentService = inject(AppointmentService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  doctorList: any;
  format = format;
  isSubmitted = false;
  selected!: any;
  
  confirmModal: boolean = false;

  closeModal() {
    this.confirmModal = false;
  }

  departmentQuery = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }));

  doctorQuery = injectQuery(() => ({
    queryKey: ['doctors'],
    queryFn: () => this.doctorsService.getDoctors(),
  }));

  appointmentMutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.appointmentService.addAppointment(formData),
    onSuccess: () => {
      // Invalidate and refetch by using the client directly
      client.invalidateQueries({ queryKey: ['appointments'] })
    },
  }));

  constructor() { }

  async onDepartmentChange(){
    this.doctorList = await this.doctorsService.filterDoctorsByDepartment(this.appointmentForm.value.departmentId);
  }

  onDoctorChange(){
    this.selected = this.doctorsService.getDoctorById(this.appointmentForm.value.drCode);
    this.updateFormValues();
  }

  appointmentForm = this.fb.group({
    companyID: environment.hospitalCode,
    pName: ['', Validators.required],
    age: ['', Validators.required],
    sex: ['', Validators.required],
    type: true,
    date: ['', Validators.required],
    sL: "",
    departmentId: "",
    drCode: '',
    fee: '',
    paymentStatus: false,
    confirmed: false,
  })

  updateFormValues(): void {
    if (this.selected) {
      this.appointmentForm.patchValue({
        departmentId: this.selected.departmentId,
        fee: this.selected.fee,
      });
    }
  }

  onSubmit(): void {
    const { pName, age, sex, date, type } = this.appointmentForm.value;
    if (pName && age && sex && date) {
        console.log('submitted form', this.appointmentForm.value);
        const formData = { ...this.appointmentForm.value, id: crypto.randomUUID() }
        this.appointmentMutation.mutate(formData);
        // toast
        this.confirmModal = true;
        this.isSubmitted = true;
    }
  }

  dates: Date[] = Array.from({ length: 8 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Define the isPastDate method
  isPastDate(date: Date): boolean {
    return isBefore(date, new Date());
  }

}

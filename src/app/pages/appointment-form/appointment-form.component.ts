import { Component, inject, OnInit } from '@angular/core';
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
import { ConfirmModalComponent } from '../../components/shared/modal/confirm-modal/confirm-modal.component';
import { AuthService } from '../../features/services/auth.service';
import { NavbarComponent } from "../../components/shared/navbar/navbar.component";

@Component({
    selector: 'app-appointment-form',
    standalone: true,
    templateUrl: './appointment-form.component.html',
    styleUrl: './appointment-form.component.css',
    imports: [CommonModule, ReactiveFormsModule, ReactIconComponent, ConfirmModalComponent, NavbarComponent]
})
export class AppointmentFormComponent implements OnInit {
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  appointmentService = inject(AppointmentService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  authService = inject(AuthService);
  doctorList: any;
  format = format;
  isSubmitted = false;
  selected!: any;
  user: any;
  confirm!: any;

  confirmModal!: boolean;

  ngOnInit(): void {
    this.getConfirm()
    // Update the form group after this.confirm is set
    this.updateFormGroup();
  }

  // Method to update the form group
  updateFormGroup(): void {
    this.appointmentForm.patchValue({
      confirmed: this.confirm
    });
  }

  closeModal() {
    this.confirmModal = false;
  }

  getConfirm() {
    this.user = this.authService.getUser();
    if (this.user.role == "Admin" || this.user.role == "SuperAdmin") {
      this.confirm = true
    } else {
      this.confirm = false
    }
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

  async onDepartmentChange() {
    this.doctorList = await this.doctorsService.filterDoctorsByDepartment(this.appointmentForm.value.departmentId);
  }

  onDoctorChange() {
    this.selected = this.doctorsService.getDoctorById(this.appointmentForm.value.drCode);
    this.updateFormValues();
  }

  appointmentForm = this.fb.group({
    companyID: environment.hospitalCode,
    pName: ['', Validators.required],
    age: [''],
    sex: [''],
    type: true,
    date: ['', Validators.required],
    sL: "",
    departmentId: "",
    drCode: '',
    fee: '',
    remarks: '',
    paymentStatus: false,
    confirmed: this.confirm,
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
    const { pName, age, sex, date, type, departmentId, sL, drCode, fee, remarks, paymentStatus, confirmed } = this.appointmentForm.value;
    if (drCode && pName && type && date) {
      // console.log('submitted form', this.appointmentForm.value);
      // const formData = { ...this.appointmentForm.value, id: crypto.randomUUID() }
      const formData = new FormData();

      formData.append('CompanyID', environment.hospitalCode.toString());
      formData.append('Date', date);
      formData.append('DepartmentId', departmentId != null ? departmentId.toString() : '');
      formData.append('SL', sL != null ? sL.toString() : '');
      formData.append('Type', type != null ? type.toString() : '');
      formData.append('DrCode', drCode != null ? drCode.toString() : '');
      formData.append('PName', pName);
      formData.append('Age', age || '');
      formData.append('Sex', sex || '');
      formData.append('Fee', fee != null ? fee.toString() : '');
      formData.append('Username', this.user.username);
      formData.append('Remarks', remarks || '');
      formData.append('PaymentStatus', paymentStatus != null ? paymentStatus.toString() : '');
      formData.append('Confirmed', confirmed != null ? confirmed.toString() : this.confirm);
      this.appointmentMutation.mutate(formData);
      // toast
      this.confirmModal = true;
      this.isSubmitted = true;
    }
  }

  dates: Date[] = Array.from({ length: 15 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Define the isPastDate method
  isPastDate(date: Date): boolean {
    return isBefore(date, new Date());
  }

}

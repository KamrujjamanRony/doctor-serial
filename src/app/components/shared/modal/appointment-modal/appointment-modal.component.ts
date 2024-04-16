import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImCross } from "react-icons/im";
import { format, isBefore } from 'date-fns';
import { injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { ReactIconComponent } from '../../react-icon/react-icon.component';
import { ToastService } from '../../../../features/services/toast.service';
import { AppointmentService } from '../../../../features/services/appointment.service';
import { DepartmentService } from '../../../../features/services/department.service';
import { DoctorsService } from '../../../../features/services/doctors.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-appointment-modal',
  standalone: true,
  templateUrl: './appointment-modal.component.html',
  styleUrl: './appointment-modal.component.css',
  providers: [DatePipe],
  imports: [CommonModule, ReactiveFormsModule, ReactIconComponent, ConfirmModalComponent]
})
export class AppointmentModalComponent {
  datePipe = inject(DatePipe);
  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  appointmentService = inject(AppointmentService);
  departmentService = inject(DepartmentService);
  doctorsService = inject(DoctorsService);
  @Input() doctor: any;
  @Input() id!: any;
  @Output() closeAppointment = new EventEmitter<void>();

  closeAppointmentModal(): void {
    this.closeAppointment.emit();
  }

  format = format;
  ImCross = ImCross;
  isSubmitted = false;
  selected!: any;
  selectedDoctor: any;
  doctorList: any;
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

  UpdateAppointmentMutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.appointmentService.updateAppointment(this.selected.id, formData),
    onSuccess: () => {
      // Invalidate and refetch by using the client directly
      client.invalidateQueries({ queryKey: ['appointments'] })
    },
  }));

  constructor() { }

  ngOnInit(): void {
    this.selected = this.appointmentService.getAppointment(this.id);
    this.updateFormValues();
  }

  async onDepartmentChange() {
    this.doctorList = await this.doctorsService.filterDoctorsByDepartment(this.appointmentForm.value.departmentId);
  }

  onDoctorChange() {
    this.selectedDoctor = this.doctorsService.getDoctorById(this.appointmentForm.value.drCode);
    this.updateForm();
  }

  appointmentForm = this.fb.group({
    companyID: [environment.hospitalCode],
    pName: ['', Validators.required],
    age: ['', Validators.required],
    sex: ['', Validators.required],
    type: [true],
    date: ['', Validators.required],
    sL: [0],
    departmentId: [''],
    drCode: [''],
    fee: [''],
    paymentStatus: [false],
    confirmed: [false],
  })

  updateFormValues(): void {
    if (this.selected) {
  
      // Format the date to yyyy-mm-dd
      const formattedDate = this.datePipe.transform(this.selected.date, 'yyyy-MM-dd');
  
      this.appointmentForm.patchValue({
        pName: this.selected.pName,
        age: this.selected.age,
        sex: this.selected.sex,
        type: this.selected.type,
        date: formattedDate, // Assign the formatted date
        sL: this.selected.sL,
        departmentId: this.selected.departmentId,
        drCode: this.selected.drCode,
        fee: this.selected.fee,
        paymentStatus: this.selected.paymentStatus,
        confirmed: this.selected.confirmed,
      });
    }
  }

  updateForm(): void {
    if (this.selectedDoctor) {
      this.appointmentForm.patchValue({
        departmentId: this.selectedDoctor.departmentId,
        fee: this.selectedDoctor.fee,
      });
    }
  }

  onSubmit(): void {
    const { pName, age, sex, date, sL, type, departmentId, drCode, fee, paymentStatus, confirmed } = this.appointmentForm.value;
    if (pName && age && sex && date) {
      if (!this.selected) {
        console.log('submitted form', this.appointmentForm.value);
        // const formData = { ...this.appointmentForm.value, departmentId: this.doctor.departmentId, sL: 5, drCode: this.doctor.id, fee: this.doctor.fee, id: crypto.randomUUID() }
        const formData = new FormData();

        formData.append('CompanyID', environment.hospitalCode.toString());
        formData.append('Date', date);
        formData.append('DepartmentId', this.doctor.departmentId);
        formData.append('SL', sL != null ? sL.toString() : '');
        formData.append('Type', type != null ? type.toString() : '');
        formData.append('DrCode', this.doctor.id);
        formData.append('PName', pName);
        formData.append('Age', age);
        formData.append('Sex', sex);
        formData.append('Fee', this.doctor.fee);
        formData.append('Username', "");
        formData.append('PaymentStatus', paymentStatus != null ? paymentStatus.toString() : '');
        formData.append('Confirmed', confirmed != null ? confirmed.toString() : '');

        this.appointmentMutation.mutate(formData);
        this.closeAppointmentModal();
        // toast
        this.confirmModal = true;
        // this.toastService.showToast('Appointment is successfully added!');
        this.isSubmitted = true;
      } else {
        // const formData = { ...this.appointmentForm.value, id: this.selected.id };
        const formData = new FormData();

        formData.append('CompanyID', environment.hospitalCode.toString());
        formData.append('Date', date);
        formData.append('DepartmentId', departmentId != null ? departmentId.toString() : '');
        formData.append('SL', sL != null ? sL.toString() : '');
        formData.append('Type', type != null ? type.toString() : '');
        formData.append('DrCode', drCode != null ? drCode.toString() : '');
        formData.append('PName', pName);
        formData.append('Age', age);
        formData.append('Sex', sex);
        formData.append('Fee', fee != null ? fee.toString() : '');
        formData.append('Username', "");
        formData.append('PaymentStatus', paymentStatus != null ? paymentStatus.toString() : '');
        formData.append('Confirmed', confirmed != null ? confirmed.toString() : '');

        this.UpdateAppointmentMutation.mutate(formData);
        this.closeAppointmentModal();
        // toast
        this.confirmModal = true;
        // this.toastService.showToast('Appointment is successfully updated!');
        this.isSubmitted = true;
      }
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

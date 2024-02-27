import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImCross } from "react-icons/im";
import { format, isBefore } from 'date-fns';
import { ReactIconComponent } from '../react-icon/react-icon.component';

@Component({
  selector: 'app-appointment-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactIconComponent],
  templateUrl: './appointment-modal.component.html',
  styleUrl: './appointment-modal.component.css'
})
export class AppointmentModalComponent {
  @Input() doctor: any;
  @Output() closeAppointment = new EventEmitter<void>();

  closeAppointmentModal(): void {
    this.closeAppointment.emit();
  }

  format = format;
  ImCross = ImCross;
  isSubmitted = false;

  constructor(private fb: FormBuilder){}

  appointmentForm = this.fb.group({
    yourName: ['', Validators.required],
    yourAge: ['', Validators.required],
    yourPhone: ['', Validators.required],
    yourEmail: ['', [Validators.required, Validators.email]],
    appointmentDate: ['', Validators.required],
    appointmentTime: ['', Validators.required],
  })

  onSubmit(): void {
    const {yourName, yourAge, yourPhone, yourEmail, appointmentDate, appointmentTime} = this.appointmentForm.value;
    if (yourName && yourAge && yourPhone && yourEmail && appointmentDate && appointmentTime) {
      console.log('submitted form', this.appointmentForm.value);
      this.closeAppointmentModal()
    }
    this.isSubmitted = true;
  }

  dates: Date[] = Array.from({ length: 8 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  timeSlots: string[] = Array.from({ length: 13 }, (_, i) => {
    const hour = (i + 9).toString().padStart(2, '0');
    return `${hour}:00 - ${hour}:59`;
  });

  // Define the isPastDate method
  isPastDate(date: Date): boolean {
    return isBefore(date, new Date());
  }

}

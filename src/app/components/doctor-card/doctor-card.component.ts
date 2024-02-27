import { Component, Input, OnInit } from '@angular/core';
import { DoctorDetailsComponent } from '../shared/doctor-details/doctor-details.component';
import { AppointmentModalComponent } from '../shared/appointment-modal/appointment-modal.component';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [DoctorDetailsComponent, AppointmentModalComponent],
  templateUrl: './doctor-card.component.html'
})
export class DoctorCardComponent implements OnInit {
  @Input() 
  doctor: any;
  @Input()
  department!: string;
  showModal: boolean = false;
  showAppointment: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  handleClick() {
    this.showAppointment = true;
    this.showModal = false;
  }

  openDoctorDetails() {
    this.showModal = true;
  }

  openAppointment() {
    this.showAppointment = true;
  }

  closeDoctorDetails() {
    this.showModal = false;
  }

  closeAppointment() {
    this.showAppointment = false;
  }

}

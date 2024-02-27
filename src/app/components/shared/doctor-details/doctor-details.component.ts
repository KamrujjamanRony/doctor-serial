import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [],
  templateUrl: './doctor-details.component.html'
})
export class DoctorDetailsComponent {
  @Input() doctor: any;
  @Output() closeDoctorDetails = new EventEmitter<void>();
  @Output() handleClick = new EventEmitter<void>();

  closeDoctorModal(): void {
    this.closeDoctorDetails.emit();
  }
  showAppointmentModal(): void {
    this.handleClick.emit();
  }

}

import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DoctorsService } from '../../features/services/doctors.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoverComponent } from "../shared/cover/cover.component";

@Component({
    selector: 'app-add-doctor',
    standalone: true,
    templateUrl: './add-doctor.component.html',
    imports: [CommonModule, FormsModule, CoverComponent]
})
export class AddDoctorComponent {
  yourTitle: any = 'add a doctor';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Add Doctor';

  model: any;
  private addDoctorSubscription?: Subscription;

  constructor(private doctorsService: DoctorsService, private router: Router) {
    this.model = {
      hospitalCode: 0,
      name: '',
      degree: '',
      designation: '',
      specialty: '',
      department: '',
      phone: '',
      visitTime: '',
      room: '',
      description: '',
      notice: '',
      imageId: '',
    }
  }


  onFormSubmit(): void {
    this.addDoctorSubscription = this.doctorsService.addDoctor(this.model)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('admin/doctors')
        }
      })
  }

  ngOnDestroy(): void {
    this.addDoctorSubscription?.unsubscribe();
  }

}

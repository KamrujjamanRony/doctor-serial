import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorsService } from '../../features/services/doctors.service';
import { CoverComponent } from "../shared/cover/cover.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-doctor',
    standalone: true,
    templateUrl: './edit-doctor.component.html',
    imports: [CoverComponent, CommonModule, FormsModule]
})
export class EditDoctorComponent {
  yourTitle: any = 'Update Doctor information';
  yourSub1: any = 'Dashboard';
  yourSub2: any = 'Edit Doctor';
  id: any | null = null;
  doctorInfo?: any;
  paramsSubscription?: Subscription;
  editDoctorSubscription?: Subscription;
  constructor(private route: ActivatedRoute, private router: Router, private doctorsService: DoctorsService) { }
  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.doctorsService.getDoctor(this.id)
            .subscribe({
              next: (response) => {
                this.doctorInfo = response;
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {
    const updateDoctorRequest: any = {
      hospitalCode: this.doctorInfo?.hospitalCode ?? 0,
      name: this.doctorInfo?.name ?? 'string',
      degree: this.doctorInfo?.degree ?? 'string',
      designation: this.doctorInfo?.designation ?? 'string',
      specialty: this.doctorInfo?.specialty ?? 'string',
      department: this.doctorInfo?.department ?? 'string',
      phone: this.doctorInfo?.phone ?? 'string',
      visitTime: this.doctorInfo?.visitTime ?? 'string',
      room: this.doctorInfo?.room ?? 'string',
      description: this.doctorInfo?.description ?? 'string',
      notice: this.doctorInfo?.notice ?? 'string',
      imageId: this.doctorInfo?.imageId ?? 'string'
    }
    if (this.id) {
      this.editDoctorSubscription = this.doctorsService.updateDoctor(this.id, updateDoctorRequest)
        .subscribe({
          next: (response) => {
            this.router.navigate(['admin/doctors']);
          }
        });
    }
  };

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.editDoctorSubscription?.unsubscribe();
  }

}

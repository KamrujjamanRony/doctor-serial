import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { ImCross } from 'react-icons/im';
import { CommonModule } from '@angular/common';
import { ReactIconComponent } from '../../react-icon/react-icon.component';
import { DoctorsService } from '../../../../features/services/doctors.service';
import { DepartmentService } from '../../../../features/services/department.service';
import { ImgbbService } from '../../../../features/services/imgbb.service';
import { environment } from '../../../../../environments/environments';

@Component({
    selector: 'app-add-doctor-modal',
    standalone: true,
    templateUrl: './add-doctor-modal.component.html',
    styleUrl: './add-doctor-modal.component.css',
    imports: [CommonModule, ReactiveFormsModule, ReactIconComponent]
})
export class AddDoctorModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  doctorsService = inject(DoctorsService);
  departmentService = inject(DepartmentService)
  imgbbService = inject(ImgbbService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  imgUrl!: any;
  private addDoctorSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }

  ImCross = ImCross;
  isSubmitted = false;

  constructor(){}

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }));

  mutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.doctorsService.addDoctor(formData),
    onSuccess: () => {
      // Invalidate and refetch by using the client directly
      client.invalidateQueries({ queryKey: ['doctors'] })
    },
  }));

  onInput(e: Event){
    const input = e.target as HTMLInputElement;

    // Check if 'files' is not null before accessing its first element
    if (input.files && input.files.length > 0) {
      this.imgbbService.upload(input.files[0]).subscribe(url => {
        this.imgUrl = url;
      });
    } else {
      console.log('No files selected.');
    }
  };

  addDoctorForm = this.fb.group({
    companyID: [environment.hospitalCode, Validators.required],
    drSerial: ['', Validators.required],
    drName: ['', Validators.required],
    degree: ['', Validators.required],
    designation: ['', Validators.required],
    specialty: ['', Validators.required],
    departmentId: ['', Validators.required],
    phone: ['', Validators.required],
    fee: ['', Validators.required],
    visitTime: ['', Validators.required],
    room: ['', Validators.required],
    description: ['', Validators.required],
    additional: ['', Validators.required],
    notice: ['', Validators.required],
    serialBlock: ['', Validators.required],
  });

  onSubmit(): void {
    const {drName, drSerial, degree, designation, specialty, departmentId, phone, fee, visitTime, room, description, additional, notice, serialBlock } = this.addDoctorForm.value;
    if (drName && drSerial && degree && designation && specialty && departmentId && phone && fee && visitTime && room && description && additional && notice && serialBlock) {
      // console.log('submitted form', this.addDoctorForm.value);
      const formData = {...this.addDoctorForm.value, "imageUrl":this.imgUrl, id: crypto.randomUUID()}
      this.mutation.mutate(formData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  }

  ngOnDestroy(): void {
    this.addDoctorSubscription?.unsubscribe();
  }
}

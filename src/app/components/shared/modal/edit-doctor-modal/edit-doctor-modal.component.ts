import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { ImCross } from 'react-icons/im';
import { ReactIconComponent } from '../../react-icon/react-icon.component';
import { DoctorsService } from '../../../../features/services/doctors.service';
import { DepartmentService } from '../../../../features/services/department.service';
import { ImgbbService } from '../../../../features/services/imgbb.service';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-edit-doctor-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactIconComponent],
  templateUrl: './edit-doctor-modal.component.html',
  styleUrl: './edit-doctor-modal.component.css'
})
export class EditDoctorModalComponent {
  @Input() id!: any;
  @Output() closeModal = new EventEmitter<void>();
  doctorsService = inject(DoctorsService);
  departmentService = inject(DepartmentService)
  imgbbService = inject(ImgbbService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  imageUrl!: any;
  selected!: any;
  private editDoctorSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }

  ImCross = ImCross;
  isSubmitted = false;

  constructor(){}

  ngOnInit(): void {
    const doctors = this.queryClient.getQueryData(['doctors']) as any[];
    this.selected = doctors?.find((d) => d.id == this.id);
    this.updateFormValues();
   }

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }));

  mutation = injectMutation((client) => ({
    mutationFn: (updateData: any) => this.doctorsService.updateDoctor(this.selected.id, updateData),
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
        this.imageUrl = url;
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

  updateFormValues(): void {
    if (this.selected) {
      this.addDoctorForm.patchValue({
        companyID: this.selected.companyID,
        drSerial: this.selected.drSerial,
        drName: this.selected.drName,
        degree: this.selected.degree,
        designation: this.selected.designation,
        specialty: this.selected.specialty,
        departmentId: this.selected.departmentId,
        phone: this.selected.phone,
        fee: this.selected.fee,
        visitTime: this.selected.visitTime,
        room: this.selected.room,
        description: this.selected.description,
        additional: this.selected.additional,
        notice: this.selected.notice,
        serialBlock: this.selected.serialBlock,
      });
      this.imageUrl = this.selected.imageUrl;
    }
  }

  onSubmit(): void {
    const {drName, drSerial, degree, designation, specialty, departmentId, phone, fee, visitTime, room, description, additional, notice, serialBlock } = this.addDoctorForm.value;
    if (drName && drSerial && degree && designation && specialty && departmentId && phone && fee && visitTime && room && description && additional && notice && serialBlock) {
      // console.log('submitted form', this.addDoctorForm.value);
      const formData = {...this.addDoctorForm.value, "imageUrl":this.imageUrl, id: this.selected.id}
      this.mutation.mutate(formData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  }

  ngOnDestroy(): void {
    this.editDoctorSubscription?.unsubscribe();
  }

}

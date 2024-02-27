import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReactIconComponent } from '../react-icon/react-icon.component';
import { ImCross } from "react-icons/im";
import { environment } from '../../../../environments/environments';
import { ImgbbService } from '../../../features/services/imgbb.service';
import { Subscription } from 'rxjs';
import { DepartmentService } from '../../../features/services/department.service';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-add-department-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactIconComponent],
  templateUrl: './add-department-modal.component.html',
  styleUrl: './add-department-modal.component.css'
})
export class AddDepartmentModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  departmentService = inject(DepartmentService);
  imgbbService = inject(ImgbbService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  imgUrl!: any;
  private addDepartmentSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }

  ImCross = ImCross;
  isSubmitted = false;

  constructor(){}

  mutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.departmentService.addDepartment(formData),
    onSuccess: () => {
      // Invalidate and refetch by using the client directly
      client.invalidateQueries({ queryKey: ['departments'] })
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

  addDepartmentForm = this.fb.group({
    companyID: [environment.hospitalCode, Validators.required],
    departmentName: ['', Validators.required],
    description: ['', Validators.required],
  });

  onSubmit(): void {
    console.log(this.addDepartmentForm.value)
    const {departmentName, description} = this.addDepartmentForm.value;
    if (departmentName && description) {
      console.log('submitted form', this.addDepartmentForm.value);
      const formData = {...this.addDepartmentForm.value, "imgUrl":this.imgUrl, id: crypto.randomUUID()}
      this.mutation.mutate(formData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  }

  ngOnDestroy(): void {
    this.addDepartmentSubscription?.unsubscribe();
  }
}

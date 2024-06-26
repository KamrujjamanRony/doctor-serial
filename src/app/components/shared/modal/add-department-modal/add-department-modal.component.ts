import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImCross } from "react-icons/im";
import { Subscription } from 'rxjs';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { ReactIconComponent } from '../../react-icon/react-icon.component';
import { DepartmentService } from '../../../../features/services/department.service';
import { ImgbbService } from '../../../../features/services/imgbb.service';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-add-department-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactIconComponent, FormsModule],
  templateUrl: './add-department-modal.component.html',
  styleUrl: './add-department-modal.component.css'
})
export class AddDepartmentModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  departmentService = inject(DepartmentService);
  imgbbService = inject(ImgbbService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
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

  addDepartmentForm = this.fb.group({
    departmentName: ['', Validators.required],
    description: [''],
    imgUrl: [''],
  });

  onSubmit(): void {
    const {departmentName, description, imgUrl} = this.addDepartmentForm.value;
    if (departmentName) {
      // console.log('submitted form', this.addDepartmentForm.value);
      
    const formData = new FormData();

    formData.append('CompanyID', environment.hospitalCode.toString());
    formData.append('DepartmentName', departmentName);
    formData.append('Description',  description != null ? description.toString() : '');
    formData.append('ImgUrl', imgUrl || '');
      // const formData = {...this.addDepartmentForm.value, "imgUrl":this.imgUrl, id: crypto.randomUUID()}
      this.mutation.mutate(formData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  }

  ngOnDestroy(): void {
    this.addDepartmentSubscription?.unsubscribe();
  }
}

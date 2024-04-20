import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ImCross } from 'react-icons/im';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactIconComponent } from '../../react-icon/react-icon.component';
import { DepartmentService } from '../../../../features/services/department.service';
import { ImgbbService } from '../../../../features/services/imgbb.service';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-edit-department-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactIconComponent, FormsModule],
  templateUrl: './edit-department-modal.component.html',
  styleUrl: './edit-department-modal.component.css'
})
export class EditDepartmentModalComponent {
  @Input() id!: any;
  @Output() closeModal = new EventEmitter<void>();
  departmentService = inject(DepartmentService);
  imgbbService = inject(ImgbbService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  selected!: any;
  private editDepartmentSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }

  ImCross = ImCross;
  isSubmitted = false;

  constructor() { }

  ngOnInit(): void {
    this.selected = this.departmentService.getDepartment(this.id)
    this.updateFormValues();
  }

  // selectedDepartment = injectQuery(() => ({
  //   queryKey: ['departments', this.id],
  //   queryFn: async () => {
  //     const response = await fetch(`${environment.DepartmentApi}/${this.id}`);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();
  //     this.selected = data;
  //   },
  // }));



  mutation = injectMutation((client) => ({
    mutationFn: (updateData: any) => this.departmentService.updateDepartment(this.selected.id, updateData),
    onSuccess: () => {
      // Invalidate and refetch by using the client directly
      client.invalidateQueries({ queryKey: ['departments'] })
    },
  }));

  addDepartmentForm = this.fb.group({
    companyID: [environment.hospitalCode, Validators.required],
    departmentName: ["", Validators.required],
    description: [""],
    imgUrl: [""],
  });

  updateFormValues(): void {
    if (this.selected) {
      this.addDepartmentForm.patchValue({
        departmentName: this.selected.departmentName,
        description: this.selected.description,
        imgUrl: this.selected.imgUrl,
      });
    }
  }

  onSubmit(): void {
    const { departmentName, description, imgUrl } = this.addDepartmentForm.value;
    if (departmentName) {
      const formData = new FormData();

      formData.append('CompanyID', environment.hospitalCode.toString());
      formData.append('DepartmentName', departmentName);
      formData.append('Description', description || '');
      formData.append('ImgUrl', imgUrl || '');
      // const formData = { "id": this.selected.id, ...this.addDepartmentForm.value, "imgUrl": this.imgUrl }
      this.mutation.mutate(formData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  };

  ngOnDestroy(): void {
    this.editDepartmentSubscription?.unsubscribe();
  }
}

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
  imgUrl!: any;
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

  onInput(e: Event) {
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
    departmentName: ["", Validators.required],
    description: [""],
  });

  updateFormValues(): void {
    if (this.selected) {
      this.addDepartmentForm.patchValue({
        departmentName: this.selected.departmentName,
        description: this.selected.description,
      });
      this.imgUrl = this.selected.imgUrl;
    }
  }

  onSubmit(): void {
    const { departmentName, description } = this.addDepartmentForm.value;
    if (departmentName) {
      const formData = new FormData();

      formData.append('CompanyID', environment.hospitalCode.toString());
      formData.append('DepartmentName', departmentName);
      formData.append('Description', description || '');
      formData.append('ImgUrl', this.imgUrl);
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

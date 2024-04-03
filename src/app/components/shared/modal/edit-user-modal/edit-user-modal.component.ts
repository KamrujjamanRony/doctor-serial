import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReactIconComponent } from '../../react-icon/react-icon.component';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../../features/services/users.service';
import { ImCross } from "react-icons/im";
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReactIconComponent],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.css'
})
export class EditUserModalComponent {
  @Input() id!: any;
  @Output() closeModal = new EventEmitter<void>();
  UsersService = inject(UsersService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  selected!: any;
  private editUserSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }

  ImCross = ImCross;
  isSubmitted = false;

  constructor() { }

  ngOnInit(): void {
    this.selected = this.UsersService.getUser(this.id)
    this.updateFormValues();
  }

  // selectedUser = injectQuery(() => ({
  //   queryKey: ['Users', this.id],
  //   queryFn: async () => {
  //     const response = await fetch(`${environment.UserApi}/${this.id}`);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();
  //     this.selected = data;
  //   },
  // }));



  mutation = injectMutation((client) => ({
    mutationFn: (updateData: any) => this.UsersService.updateUser(this.selected.id, updateData),
    onSuccess: () => {
      // Invalidate and refetch by using the client directly
      client.invalidateQueries({ queryKey: ['users'] })
    },
  }));

  addUserForm = this.fb.group({
    companyID: [environment.hospitalCode, Validators.required],
    username: ["", Validators.required],
    password: ["", Validators.required],
    role: ["user", Validators.required],
  });

  updateFormValues(): void {
    if (this.selected) {
      this.addUserForm.patchValue({
        companyID: this.selected.companyID,
        username: this.selected.username,
        password: this.selected.password,
        role: this.selected.role,
      });
    }
  }

  onSubmit(): void {
    const { username, password, role } = this.addUserForm.value;
    if (username && password && role) {
      const updateData = { "id": this.selected.id, ...this.addUserForm.value }
      this.mutation.mutate(updateData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  };

  ngOnDestroy(): void {
    this.editUserSubscription?.unsubscribe();
  }

}

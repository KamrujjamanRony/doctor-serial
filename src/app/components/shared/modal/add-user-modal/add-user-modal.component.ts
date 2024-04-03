import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { ImCross } from "react-icons/im";
import { environment } from '../../../../../environments/environments';
import { UsersService } from '../../../../features/services/users.service';
import { ReactIconComponent } from "../../react-icon/react-icon.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-add-user-modal',
    standalone: true,
    templateUrl: './add-user-modal.component.html',
    styleUrl: './add-user-modal.component.css',
    imports: [CommonModule, ReactiveFormsModule, ReactIconComponent]
})
export class AddUserModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  UsersService = inject(UsersService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  private addUsersSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }

  ImCross = ImCross;
  isSubmitted = false;

  constructor(){}

  mutation = injectMutation((client) => ({
    mutationFn: (formData: any) => this.UsersService.addUser(formData),
    onSuccess: () => {
      // Invalidate and refetch by using the client directly
      client.invalidateQueries({ queryKey: ['users'] })
    },
  }));

  addUsersForm = this.fb.group({
    companyID: [environment.hospitalCode, Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: ['user', Validators.required],
  });

  onSubmit(): void {
    console.log(this.addUsersForm.value)
    const {username, password, role} = this.addUsersForm.value;
    if (username && password && role) {
      console.log('submitted form', this.addUsersForm.value);
      const formData = {...this.addUsersForm.value, id: crypto.randomUUID()}
      this.mutation.mutate(formData);
      this.closeThisModal();
    }
    this.isSubmitted = true;
  }

  ngOnDestroy(): void {
    this.addUsersSubscription?.unsubscribe();
  }

}

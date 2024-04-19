import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { ImCross } from "react-icons/im";
import { environment } from '../../../../../environments/environments';
import { ReactIconComponent } from "../../react-icon/react-icon.component";
import { CommonModule } from '@angular/common';
import { UserAuthService } from '../../../../features/services/userAuth.service';
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component";

@Component({
    selector: 'app-add-user-modal',
    standalone: true,
    templateUrl: './add-user-modal.component.html',
    styleUrl: './add-user-modal.component.css',
    imports: [CommonModule, ReactiveFormsModule, ReactIconComponent, ConfirmModalComponent]
})
export class AddUserModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  UserAuthService = inject(UserAuthService);
  fb = inject(FormBuilder);
  queryClient = injectQueryClient();
  private addUsersSubscription?: Subscription;

  closeThisModal(): void {
    this.closeModal.emit();
  }

  ImCross = ImCross;
  isSubmitted = false;
  confirmModal: boolean = false;

  constructor(){}

  closeConfirmModal() {
    this.confirmModal = false;
  }

  // mutation = injectMutation((client) => ({
  //   mutationFn: (formData: any) => this.UsersService.addUser(formData),
  //   onSuccess: () => {
  //     client.invalidateQueries({ queryKey: ['users'] })
  //   },
  // }));

  addUsersForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: ['User', Validators.required],
  });

  onSubmit(): void {
    const {username, password, role} = this.addUsersForm.value;
    if (username && password && role) {
      // console.log('submitted form', this.addUsersForm.value);
      // const formData = {username: username, password: environment.userCode + password, role: role, id: crypto.randomUUID()}
      const formData = new FormData();

    formData.append('CompanyID', environment.hospitalCode.toString());
    formData.append('Username', username);
    formData.append('Password', environment.userCode + password);
      // this.mutation.mutate(formData);
      this.addUsersSubscription = this.UserAuthService.registerUser(role, formData)
      .subscribe({
        next: (response) => {
          // toast
          this.confirmModal = true;
          setTimeout(() => {
            this.closeThisModal();
          }, 3000);
        },
        error: (error) => {
          console.error('Error adding user:', error);
        }
      });
    }
    this.isSubmitted = true;
  }

  ngOnDestroy(): void {
    this.addUsersSubscription?.unsubscribe();
  }

}

import { Component, inject } from '@angular/core';
// import { UsersService } from '../../features/services/users.service';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { AddUserModalComponent } from "../../components/shared/modal/add-user-modal/add-user-modal.component";
import { EditUserModalComponent } from "../../components/shared/modal/edit-user-modal/edit-user-modal.component";

@Component({
    selector: 'app-all-users',
    standalone: true,
    templateUrl: './all-users.component.html',
    styleUrl: './all-users.component.css',
    imports: [CoverComponent, AddUserModalComponent, EditUserModalComponent]
})
export class AllUsersComponent {
  // usersService = inject(UsersService)
  queryClient = injectQueryClient()
  emptyImg: any;
  selectedId: any;
  addUserModal: boolean = false;
  editUserModal: boolean = false;
  private UserSubscription?: Subscription;
  
  // query = injectQuery(() => ({
  //   queryKey: ['users'],
  //   queryFn: () => this.usersService.getUsers(),
  // }));

  // mutation = injectMutation((client) => ({
  //   mutationFn: (id: any) => this.usersService.deleteUser(id),
  //   onSuccess: () => {
  //     client.invalidateQueries({ queryKey: ['users'] })
  //   },
  // }));

  onDelete(id: any) {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      // this.mutation.mutate(id);
    }
  }

  openAddUserModal() {
    this.addUserModal = true;
  }

  openEditUserModal(id: any) {
    this.selectedId = id;
    this.editUserModal = true;
  }

  closeAddUserModal() {
    this.addUserModal = false;
  }

  closeEditUserModal() {
    this.editUserModal = false;
  }

  ngOnDestroy(): void {
    this.UserSubscription?.unsubscribe();
  }

}

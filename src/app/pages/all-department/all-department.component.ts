import { Component, inject } from '@angular/core';
import { DepartmentService } from '../../features/services/department.service';
import { CoverComponent } from '../../components/shared/cover/cover.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { AddDepartmentModalComponent } from '../../components/shared/modal/add-department-modal/add-department-modal.component';
import { EditDepartmentModalComponent } from '../../components/shared/modal/edit-department-modal/edit-department-modal.component';
import { NavbarComponent } from "../../components/shared/navbar/navbar.component";

@Component({
    selector: 'app-all-department',
    standalone: true,
    templateUrl: './all-department.component.html',
    styleUrl: './all-department.component.css',
    imports: [CoverComponent, RouterLink, AddDepartmentModalComponent, CommonModule, EditDepartmentModalComponent, NavbarComponent]
})
export class AllDepartmentComponent {
  departmentService = inject(DepartmentService)
  queryClient = injectQueryClient()
  emptyImg: any;
  departments: any;
  selectedId: any;
  showModal: boolean = false;
  addDepartmentModal: boolean = false;
  editDepartmentModal: boolean = false;
  private departmentSubscription?: Subscription;

  constructor() { }

  ngOnInit(): void { }

  query = injectQuery(() => ({
    queryKey: ['departments'],
    queryFn: () => this.departmentService.getDepartments(),
  }));

  


  mutation = injectMutation((client) => ({
    mutationFn: (id: any) => this.departmentService.deleteDepartment(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['departments'] })
    },
  }));

  onDelete(id: any) {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.mutation.mutate(id);
    }
  }

  // handleClick() {
  //   this.addDepartmentModal = true;
  //   this.showModal = false;
  // }

  openDoctorDetails() {
    this.showModal = true;
  }

  openAddDepartmentModal() {
    this.addDepartmentModal = true;
  }

  openEditDepartmentModal(id: any) {
    this.selectedId = id;
    this.editDepartmentModal = true;
  }

  closeDoctorDetails() {
    this.showModal = false;
  }

  closeAddDepartmentModal() {
    this.addDepartmentModal = false;
  }

  closeEditDepartmentModal() {
    this.editDepartmentModal = false;
  }

  ngOnDestroy(): void {
    this.departmentSubscription?.unsubscribe();
  }
}

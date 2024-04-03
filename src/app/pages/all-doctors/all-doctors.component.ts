import { Component, Renderer2, inject } from '@angular/core';
import { DoctorsService } from '../../features/services/doctors.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { Subscription } from 'rxjs';
import { AddDoctorModalComponent } from '../../components/shared/modal/add-doctor-modal/add-doctor-modal.component';
import { EditDoctorModalComponent } from '../../components/shared/modal/edit-doctor-modal/edit-doctor-modal.component';
@Component({
    selector: 'app-all-doctors',
    standalone: true,
    templateUrl: './all-doctors.component.html',
    styleUrl: './all-doctors.component.css',
    imports: [CommonModule, RouterLink, CoverComponent, AddDoctorModalComponent, EditDoctorModalComponent]
})
export class AllDoctorsComponent {
  doctorsService = inject(DoctorsService)
  queryClient = injectQueryClient()
  emptyImg: any;
  selectedId: any;
  addDoctorModal: boolean = false;
  editDoctorModal: boolean = false;
  private doctorSubscription?: Subscription;

  constructor() {}

  ngOnInit(): void {}

  query = injectQuery(() => ({
    queryKey: ['doctors'],
    queryFn: () => this.doctorsService.getDoctors(),
  }));

  

  mutation = injectMutation((client) => ({
    mutationFn: (id: any) => this.doctorsService.deleteDoctor(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['doctors'] })
    },
  }));

  onDelete(id: any) {
    const result = confirm("Are you sure you want to delete this item?");
    if (result === true) {
      this.mutation.mutate(id);
    }
  }

  openAddDoctorModal() {
    this.addDoctorModal = true;
  }

  openEditDoctorModal(id: any) {
    this.selectedId = id;
    this.editDoctorModal = true;
  }

  closeAddDoctorModal() {
    this.addDoctorModal = false;
  }

  closeEditDoctorModal() {
    this.editDoctorModal = false;
  }

  ngOnDestroy(): void {
    this.doctorSubscription?.unsubscribe();
  }
}

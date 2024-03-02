import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { DoctorsListComponent } from './components/doctors-list/doctors-list.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { AllDepartmentComponent } from './pages/all-department/all-department.component';
import { AllDoctorsComponent } from './pages/all-doctors/all-doctors.component';
import { AllAppointmentComponent } from './pages/all-appointment/all-appointment.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      {
        path: '',
        component: DepartmentsComponent
      },
      {
        path: 'serial/:department',
        component: DoctorsListComponent
      },
      {
        path: 'doctor/:id',
        component: DoctorComponent
      },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: DoctorsListComponent },
      { path: 'doctors', component: AllDoctorsComponent },
      { path: 'department-list', component: AllDepartmentComponent },
      { path: 'all-appointment', component: AllAppointmentComponent },
    ],
  },
];

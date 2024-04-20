import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { DoctorsListComponent } from './components/doctors-list/doctors-list.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { AllDepartmentComponent } from './pages/all-department/all-department.component';
import { AllDoctorsComponent } from './pages/all-doctors/all-doctors.component';
import { AllAppointmentComponent } from './pages/all-appointment/all-appointment.component';
import { AppointmentFormComponent } from './pages/appointment-form/appointment-form.component';
import { AllUsersComponent } from './pages/all-users/all-users.component';
import { MyAppointmentsComponent } from './pages/my-appointments/my-appointments.component';
import { RedirectComponent } from './pages/redirect.component';
import { PrintAppointmentComponent } from './pages/print-appointment/print-appointment.component';

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
        path: 'appointment-form',
        component: AppointmentFormComponent
      },
      {
        path: 'my-appointments',
        component: MyAppointmentsComponent
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
      { path: '', component: AllDepartmentComponent },
      { path: 'department-list', component: AllDepartmentComponent },
      { path: 'doctors', component: AllDoctorsComponent },
      { path: 'all-appointment', component: RedirectComponent  },
      { path: 'all-user', component: AllUsersComponent },
    ],
  },
  {
    path: 'all-appointment',
    component: AllAppointmentComponent,
  },
  {
    path: 'print',
    component: PrintAppointmentComponent,
  },
];

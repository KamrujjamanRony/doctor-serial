import { Component } from '@angular/core';
import { CoverComponent } from "../shared/cover/cover.component";
import { DoctorsService } from '../../features/services/doctors.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from "../shared/page-header/page-header.component";
import { DoctorCardComponent } from '../doctor-card/doctor-card.component';

@Component({
    selector: 'app-doctors-list',
    standalone: true,
    templateUrl: './doctors-list.component.html',
    imports: [CoverComponent, CommonModule, RouterLink, PageHeaderComponent, DoctorCardComponent]
})
export class DoctorsListComponent {
  department: any;
  doctorList: any[] = [];
  emptyImg: any = '../../../../assets/images/doctor.png';

  
  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.department = params['department'];
      this.filterDoctorsByDepartment(this.department);
    });
  }

  filterDoctorsByDepartment(department: string): void {
    this.doctorService.getDoctors().subscribe(doctors => {
      this.doctorList = doctors.filter(doctor => doctor.department === department);
    });
  }

}

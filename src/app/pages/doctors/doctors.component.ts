import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorsService } from '../../features/services/doctors.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoverComponent } from "../../components/shared/cover/cover.component";

@Component({
    selector: 'app-doctors',
    standalone: true,
    templateUrl: './doctors.component.html',
    styleUrl: './doctors.component.css',
    imports: [CommonModule, RouterLink, CoverComponent]
})
export class DoctorsComponent {
  yourTitle: any = 'all doctors list';
  yourSub1: any = 'Home';
  yourSub2: any = 'Doctors';
  emptyImg: any = '../../../../assets/images/doctor.png';
  
  doctors$?: Observable<any[]>;

  constructor(private doctorsService: DoctorsService) {}
  ngOnInit(): void {
    this.doctors$ = this.doctorsService.getAllDoctors();
  }

}

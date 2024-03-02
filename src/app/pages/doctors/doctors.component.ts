import { Component, Renderer2 } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DoctorsService } from '../../features/services/doctors.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { environment } from '../../../environments/environments';

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
  
  hospitalDoctors$?: Observable<any[]>;
  hospitalCode: any = environment.hospitalCode;

  constructor(private doctorsService: DoctorsService, private renderer: Renderer2) {}

  ngOnInit(): void {
    // this.hospitalDoctors$ = this.doctorsService.getAllDoctors().pipe(
    //   map((doctors: any[]) =>
    //     doctors.filter((doctor: any) => doctor.hospitalCode == this.hospitalCode)
    //   )
    // );
  }

  scrollToTop() {
    // Scroll to the top of the page
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);
  }

}

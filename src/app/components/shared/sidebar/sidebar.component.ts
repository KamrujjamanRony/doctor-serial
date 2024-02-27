import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environments';
import { AboutService } from '../../../features/services/about.service';
import { ContactService } from '../../../features/services/contact.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [RouterLink]
})
export class SidebarComponent implements OnInit {
  companyID: any = environment.hospitalCode.toString();
  allAbout$?: Observable<any[]>;
  allAddress$?: Observable<any[]>;
  about!: any;
  address!: any;
  constructor(private aboutService: AboutService, private contactService: ContactService) { }
  ngOnInit(): void {
    this.allAbout$ = this.aboutService.getAllAbout();
    this.allAbout$.subscribe(aboutUs => {
      if (aboutUs) {
        this.about = aboutUs.find(a => a.companyID === this.companyID);
      }
    });
    this.allAddress$ = this.contactService.getAllContact();
    this.allAddress$.subscribe(addressUs => {
      if (addressUs) {
        this.address = addressUs.find(a => a.companyID === this.companyID);
      }
    });
  }

}

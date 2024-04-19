import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  template: '',
  styleUrls: []
})
export class RedirectComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.redirectToAllAppointment();
  }

  redirectToAllAppointment(): void {
    this.router.navigateByUrl('/all-appointment');
  }
}

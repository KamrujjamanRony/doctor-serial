import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { ActiveLinkComponent } from "../active-link/active-link.component";
import { AuthService } from '../../../features/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [CommonModule, RouterLink, ActiveLinkComponent]
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  user: any;
  menuItems = [
    {
      label: 'Home',
      link: '/'
    },
    {
      label: 'Appointment Form',
      link: 'appointment-form'
    },
    {
      label: 'My Appointments',
      link: 'my-appointments'
    },
    {
      label: 'Admin',
      link: 'admin'
    },
  ];
  isMenuOpen = false;

  constructor(){
    this.user = this.authService.getUser();
  }

  logOut() {
    this.authService.deleteUser();

    // Reload the current route
    window.location.reload();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}

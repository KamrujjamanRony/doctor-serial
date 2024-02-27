import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActiveLinkComponent } from "../active-link/active-link.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [CommonModule, RouterLink, ActiveLinkComponent]
})
export class NavbarComponent {
  menuItems = [
    {
      label: 'Home',
      link: '/'
    }
  ];
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}

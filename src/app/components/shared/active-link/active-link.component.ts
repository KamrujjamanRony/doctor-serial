import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-active-link',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <a [routerLink]="to" [ngClass]="{'border-b-2': isActive}">
      {{ children }}
    </a>
  `
})
export class ActiveLinkComponent {
  @Input() to!: string;
  @Input() children!: string;
  @Input() isDropdownOpen!: boolean;

  constructor(private router: Router) {}

  get isActive(): boolean {
    if (this.router.url.includes(this.to)) {
      return true;
    } else {
      return false;
    }
    // return this.router.isActive(this.to, true);
  }
  handleDropdownOpen(){
    this.isDropdownOpen =false;
  }
}


import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from "../../components/shared/navbar/navbar.component";
import { FooterComponent } from "../../components/shared/footer/footer.component";
import { environment } from '../../../environments/environments';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { UsersService } from '../../features/services/users.service';
import { AuthService } from '../../features/services/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  imports: [CommonModule, RouterOutlet, FormsModule, NavbarComponent, FooterComponent, ReactiveFormsModule]
})
export class MainComponent {
  usersService = inject(UsersService);
  authService = inject(AuthService);
  queryClient = injectQueryClient();
  fb = inject(FormBuilder);
  isSubmitted = false;
  user: any;

  query = injectQuery(() => ({
    queryKey: ['users'],
    queryFn: () => this.usersService.getUsers(),
  }));

  constructor(){
    this.setUser();
  }

  userForm = this.fb.group({
    companyID: [environment.hospitalCode],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    const users = this.query.data();
    const { username, password } = this.userForm.value;
    if (username && password) {
      const selected = users?.find(user => user.username == username && user.password == password);
      if (selected) {
        this.authService.setUser(selected);
        this.setUser();
      }
      this.isSubmitted = true;
    }
  };

  setUser(){
    this.user = this.authService.getUser();
  }
}

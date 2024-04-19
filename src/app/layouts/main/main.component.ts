import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from "../../components/shared/navbar/navbar.component";
import { FooterComponent } from "../../components/shared/footer/footer.component";
import { environment } from '../../../environments/environments';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { AuthService } from '../../features/services/auth.service';
import { UserAuthService } from '../../features/services/userAuth.service';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  imports: [CommonModule, RouterOutlet, FormsModule, NavbarComponent, FooterComponent, ReactiveFormsModule]
})
export class MainComponent {
  // usersService = inject(UsersService);
  authService = inject(AuthService);
  UserAuthService = inject(UserAuthService);
  queryClient = injectQueryClient();
  fb = inject(FormBuilder);
  isSubmitted = false;
  user: any;
  private loginSubscription?: Subscription;

  // query = injectQuery(() => ({
  //   queryKey: ['users'],
  //   queryFn: () => this.usersService.getUsers(),
  // }));

  constructor(){
    this.setUser();
  }

  userForm = this.fb.group({
    companyID: [environment.hospitalCode],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    // const users = this.query.data();
    let { username, password } = this.userForm.value;
    if (username && password) {
      password = environment.userCode + password;
      const formData = {username, password}
      this.loginSubscription = this.UserAuthService.loginUser(formData)
      .subscribe({
        next: (response: any) => {
          const userModel = {token: response.token, username: response.userName, role: response.userRoles[0]};
          this.authService.setUser(userModel);
          this.setUser();
        },
        error: (error) => {
          console.error('Error adding user:', error);
        }
      });
      this.isSubmitted = true;
    }
  };

  getLocation(){
    
  }

  setUser(){
    this.user = this.authService.getUser();
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private localStorageKey = 'user';

  setUser(user: any) {
    
    // Save user to local storage
    localStorage.setItem(this.localStorageKey, JSON.stringify(user));
  }

  getUser() {
    // Retrieve user from local storage
    const storedUser = localStorage.getItem(this.localStorageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  deleteUser() {
    // Remove user from local storage
    localStorage.removeItem(this.localStorageKey);
  }
}

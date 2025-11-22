import { computed, Injectable, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode"

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private user = signal<User | null>(null);
  readonly currentUser = computed(() => this.user());

  setUser(token: string) {
    sessionStorage.setItem('token', token);
    const decodedToken:any = jwtDecode(token);
    const userData: User = {
      token: token,
      nameid: 20,//Number(decodedToken.nameid),
      role: decodedToken.role,
      unique_name: decodedToken.unique_name
    };
    this.user.set(userData);
    // Store the complete user data in sessionStorage
    sessionStorage.setItem('user', JSON.stringify(userData));
  }

  getUser() {
    const user = this.getUserFromLocalStorage();
    return user || this.user();
  }

  clearUser() {
    this.user.set(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

  private getUserFromLocalStorage(): User | null {
    // First try to get the user data from sessionStorage
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch (e) {
        console.error('Error parsing user data from sessionStorage', e);
      }
    }
    
    // Fallback: reconstruct from token if user data is not available
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return {
          token: token,
          nameid: 20, // Number(decodedToken.nameid),
          role: decodedToken.role,
          unique_name: decodedToken.unique_name
        };
      } catch (e) {
        console.error('Error decoding token', e);
      }
    }
    return null;
  }

  setUserFromLocalStorage(): void {
    const user = this.getUserFromLocalStorage();
    if (user) {
      this.user.set(user);
    }
  }

  constructor() { }

}

export interface User {
  token: string;
  nameid: number;
  role: string;
  unique_name: string;
}

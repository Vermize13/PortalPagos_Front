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
    this.user.set({
      token: token,
      nameid: 20,//Number(decodedToken.nameid),
      role: decodedToken.role,
      unique_name: decodedToken.unique_name
    });
  }

  getUser() {
    const user = this.getUserFromLocalStorage();
    return user || this.user();
  }

  clearUser() {
    this.user.set(null);
    sessionStorage.removeItem('token');
  }

  private getUserFromLocalStorage(): User | null {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return {
        token: token,
        nameid: 20, // Number(decodedToken.nameid),
        role: decodedToken.role,
        unique_name: decodedToken.unique_name
      };
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

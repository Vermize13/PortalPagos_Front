import { computed, Injectable, signal } from '@angular/core';
import { jwtDecode } from "jwt-decode"

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private user = signal<User | null>(null);
  readonly currentUser = computed(() => this.user());

  setUser(token: string) {
    localStorage.setItem('token', token);
    const decodedToken:any = jwtDecode(token);
    this.user.set({
      token: token,
      nameid: 20,//Number(decodedToken.nameid),
      role: decodedToken.role,
      unique_name: decodedToken.unique_name
    });
  }

  getUser() {
    this.getUserFromLocalStorage();
    return this.currentUser();
  }

  clearUser() {
    this.user.set(null);
    localStorage.removeItem('token');
  }

  private getUserFromLocalStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken:any = jwtDecode(token);
      this.user.set({
        token: token,
        nameid: 20,// Number(decodedToken.nameid),
        role: decodedToken.role,
        unique_name: decodedToken.unique_name
      });
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

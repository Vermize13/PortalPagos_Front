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
    const roleClaim = this.extractRoleClaim(decodedToken);
    const normalizedRole = this.normalizeRole(roleClaim);
    const userData: User = {
      token: token,
      nameid: 20,//Number(decodedToken.nameid),
      role: normalizedRole,
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
        const roleClaim = this.extractRoleClaim(decodedToken);
        return {
          token: token,
          nameid: 20, // Number(decodedToken.nameid),
          role: this.normalizeRole(roleClaim),
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

  private extractRoleClaim(decodedToken: any): string | null {
    if (!decodedToken) {
      return null;
    }

    const possibleKeys = [
      'role',
      'roles',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'
    ];

    for (const key of possibleKeys) {
      const value = decodedToken[key];
      if (value) {
        if (Array.isArray(value)) {
          return value[0];
        }
        return value as string;
      }
    }

    return null;
  }

  private normalizeRole(rawRole: string | null): string {
    if (!rawRole) {
      return '';
    }

    const roleString = String(rawRole).trim();
    if (!roleString) {
      return '';
    }

    const normalizedKey = roleString
      .toLowerCase()
      .replace(/á/g, 'a')
      .replace(/é/g, 'e')
      .replace(/í/g, 'i')
      .replace(/ó/g, 'o')
      .replace(/ú/g, 'u')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');

    const roleMap: Record<string, string> = {
      admin: 'admin',
      administrador: 'admin',
      administrador_general: 'admin',
      administrador_general_role: 'admin',
      administrador_general_findeter: 'admin',
      scrum_master: 'scrum_master',
      product_owner: 'product_owner',
      stakeholder: 'stakeholder',
      lider_tecnico: 'tech_lead',
      lider_tecnic: 'tech_lead',
      lider_tec: 'tech_lead',
      tech_lead: 'tech_lead',
      desarrollador: 'developer',
      developer: 'developer',
      dev: 'developer',
      qa: 'tester',
      tester: 'tester',
      qa_tester: 'tester',
      qa_tester_role: 'tester'
    };

    return roleMap[normalizedKey] || normalizedKey;
  }

}

export interface User {
  token: string;
  nameid: number;
  role: string;
  unique_name: string;
}

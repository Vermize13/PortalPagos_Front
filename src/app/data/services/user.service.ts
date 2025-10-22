import { Injectable } from '@angular/core';
import { User as AuthUser, UserStateService } from '../states/userState.service';
import { User as DomainUser } from '../../domain/models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userState: UserStateService, private http: HttpClient) { }
  urlAuth = `${environment.url}api/Auth/`;
  urlPass = `${environment.url}api/Password/`;
  urlUsers = `${environment.url}api/Users`;

  isLoggedIn(): boolean {
    // Implementa la lógica para verificar si el usuario está autenticado
    return !!localStorage.getItem('token'); //
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post<AuthUser>(`${this.urlAuth}login`, { username, password })
    .pipe(
      tap( (user: AuthUser) => {
        this.userState.setUser(user.token);
         this.enable2fa();
      })
    );
  }

  enable2fa(): Observable<any> {
    const userId = this.userState?.getUser()?.nameid;
    return this.http.post(`${this.urlAuth}enable-2fa?userId=${userId}`, {}, {
      responseType: 'text'
    });

  }

  verify2fa(code: string): Observable<string> {
    const userId = this.userState?.getUser()?.nameid;
    return this.http.post(`${this.urlAuth}verify-2fa?userId=${userId}&otp=${code}`, {}, {
      responseType: 'text'
    });
  }

  passWordRecovery(email: string): Observable<string> {
    return this.http.post(`${this.urlPass}recover`, {email}, {
      responseType: 'text'
    });
  }

  passwordReset(newPassword:string): Observable<string> {
    const userId = 20//this.userState?.getUser()?.nameid;
    return this.http.post(`${this.urlPass}reset`, {
      userId,
      newPassword
    }, {
      responseType: 'text'
    });
  }

  passwordChange(currentPassword:string, newPassword:string): Observable<string>{
    const userId = 20//this.userState?.getUser()?.nameid;
    return this.http.post(`${this.urlPass}change`, {
      userId,
      currentPassword,
      newPassword
    }, {
      responseType: 'text'
    });

  }

  // Users API endpoints from OpenAPI spec
  getAllUsers(): Observable<DomainUser[]> {
    return this.http.get<DomainUser[]>(this.urlUsers);
  }

  getUserById(id: string): Observable<DomainUser> {
    return this.http.get<DomainUser>(`${this.urlUsers}/${id}`);
  }

  getUserByEmail(email: string): Observable<DomainUser> {
    return this.http.get<DomainUser>(`${this.urlUsers}/by-email/${email}`);
  }

}

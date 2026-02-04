import { Injectable } from '@angular/core';
import { User as AuthUser, UserStateService } from '../states/userState.service';
import { User as DomainUser } from '../../domain/models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userState: UserStateService, private http: HttpClient) { }
  urlAuth = `${environment.url}api/Auth/`;
  urlPass = `${environment.url}api/Password/`;
  urlUsers = `${environment.url}api/Users`;

  createUser(request: CreateUserRequest): Observable<DomainUser> {
    const payload = this.buildSavePayload(request);

    return this.http.post<DomainUser>(this.urlUsers, payload).pipe(
      map(user => this.mapUserResponse(user))
    );
  }

  updateUser(userId: string, request: UpdateUserRequest): Observable<DomainUser> {
    const payload = this.buildSavePayload(request);

    return this.http.put<DomainUser>(`${this.urlUsers}/${userId}`, payload).pipe(
      map(user => this.mapUserResponse(user))
    );
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.urlUsers}/${userId}`);
  }

  isLoggedIn(): boolean {
    // Implementa la lógica para verificar si el usuario está autenticado
    return !!sessionStorage.getItem('token'); //
  }
  login(username: string, password: string): Observable<any> {
    return this.http.post<AuthUser>(`${this.urlAuth}login`, { username, password })
      .pipe(
        tap((user: AuthUser) => {
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
    return this.http.post(`${this.urlPass}recover`, { email }, {
      responseType: 'text'
    });
  }

  passwordReset(token: string, newPassword: string): Observable<string> {
    return this.http.post(`${this.urlPass}reset`, {
      token,
      newPassword
    }, {
      responseType: 'text'
    });
  }

  passwordChange(currentPassword: string, newPassword: string): Observable<string> {
    const userId = this.userState?.getUser()?.nameid;
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
    return this.http.get<DomainUser[]>(this.urlUsers).pipe(
      map(users => users.map(user => this.mapUserResponse(user)))
    );
  }

  getUserById(id: string): Observable<DomainUser> {
    return this.http.get<DomainUser>(`${this.urlUsers}/${id}`).pipe(
      map(user => this.mapUserResponse(user))
    );
  }

  getUserByEmail(email: string): Observable<DomainUser> {
    return this.http.get<DomainUser>(`${this.urlUsers}/by-email/${email}`).pipe(
      map(user => this.mapUserResponse(user))
    );
  }

  private mapUserResponse(user: UserLike): DomainUser {
    if (!user) {
      return user as unknown as DomainUser;
    }

    // Get role from either the role property or from userRoles array (for backward compatibility)
    const roleFromUserRoles = Array.isArray(user.userRoles)
      ? user.userRoles
        .map(userRole => userRole?.role)
        .filter((role): role is NonNullable<DomainUser['role']> => Boolean(role))[0]
      : undefined;

    const primaryRole = user.role ?? roleFromUserRoles;

    return {
      ...user,
      role: primaryRole
    } as DomainUser;
  }

  private buildSavePayload(request: BaseUserRequest): SaveUserPayload {
    const payload: SaveUserPayload = {
      name: request.name,
      email: request.email,
      username: request.username,
      roleCode: request.roleCode,
      role: request.roleCode,
      isActive: request.isActive
    };

    if (request.roleId) {
      payload.roleId = request.roleId;
    }

    if (request.password) {
      payload.password = request.password;
    }

    return payload;
  }

}

export interface BaseUserRequest {
  name: string;
  email: string;
  username: string;
  roleCode: string;
  roleId?: string;
  isActive: boolean;
  password?: string;
}

export interface CreateUserRequest extends BaseUserRequest {
  password: string;
}

export interface UpdateUserRequest extends BaseUserRequest {
  password?: string;
}

type UserLike = DomainUser & {
  userRoles?: Array<{ role?: DomainUser['role'] } & Record<string, unknown>>;
};

export interface SaveUserPayload {
  name: string;
  email: string;
  username: string;
  roleCode: string;
  role: string;
  roleId?: string;
  isActive: boolean;
  password?: string;
}

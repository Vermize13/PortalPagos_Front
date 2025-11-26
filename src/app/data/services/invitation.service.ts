import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface InviteUserRequest {
  fullName: string;
  email: string;
  roleId: string;
}

export interface InvitationResponse {
  id: string;
  email: string;
  fullName: string;
  roleName: string;
  expiresAt: Date;
  message: string;
}

export interface ValidateInvitationResponse {
  isValid: boolean;
  email: string;
  fullName: string;
  roleName: string;
  message: string;
}

export interface CompleteInvitationRequest {
  token: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  expiresAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private readonly urlInvitations = `${environment.url}api/Invitations`;

  constructor(private http: HttpClient) {}

  inviteUser(request: InviteUserRequest): Observable<InvitationResponse> {
    return this.http.post<InvitationResponse>(this.urlInvitations, request);
  }

  validateInvitation(token: string): Observable<ValidateInvitationResponse> {
    return this.http.get<ValidateInvitationResponse>(`${this.urlInvitations}/validate/${token}`);
  }

  completeInvitation(request: CompleteInvitationRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.urlInvitations}/complete`, request);
  }
}

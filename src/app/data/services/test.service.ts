import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private readonly apiUrl = `${environment.url}api/Test`;

  constructor(private http: HttpClient) { }

  getPublic(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/public`);
  }

  getProtected(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/protected`);
  }

  getAdminOnly(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin-only`);
  }

  getManagement(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/management`);
  }

  getDevelopers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/developers`);
  }
}

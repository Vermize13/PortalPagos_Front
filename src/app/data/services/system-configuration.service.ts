import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigurationService {
  private apiUrl = `${environment.url}api/configuration`;

  constructor(private http: HttpClient) { }

  getConfiguration(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateConfiguration(config: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, config);
  }

  getPublicConfiguration(): Observable<any> {
    // If you implemented the public endpoint
    return this.http.get<any>(`${this.apiUrl}/public`);
  }
}

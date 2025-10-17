import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditLog, AuditLogWithUser, AuditAction, AuditEntityType } from '../../domain/models';

export interface AuditLogFilter {
  userId?: number;
  action?: AuditAction;
  entityType?: AuditEntityType;
  startDate?: Date;
  endDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly apiUrl = `${environment.url}api/audit`;

  constructor(private http: HttpClient) { }

  getAll(filter?: AuditLogFilter): Observable<AuditLogWithUser[]> {
    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            params = params.set(key, value.toISOString());
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }
    return this.http.get<AuditLogWithUser[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<AuditLogWithUser> {
    return this.http.get<AuditLogWithUser>(`${this.apiUrl}/${id}`);
  }

  export(filter?: AuditLogFilter): Observable<Blob> {
    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            params = params.set(key, value.toISOString());
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }
    return this.http.get(`${this.apiUrl}/export`, { 
      params,
      responseType: 'blob' 
    });
  }
}

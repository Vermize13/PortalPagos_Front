import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditLog, AuditAction, AuditEntityType } from '../../domain/models';

export interface AuditLogFilter {
  userId?: string;
  action?: AuditAction;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

export interface AuditFilterRequest {
  userId?: string;
  action?: AuditAction;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface AuditLogPagedResponse {
  logs: AuditLog[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly apiUrl = `${environment.url}api/Audit`;

  constructor(private http: HttpClient) { }

  /**
   * Get audit logs with pagination
   * API endpoint: POST /api/Audit/logs
   */
  getAll(filter?: AuditLogFilter): Observable<AuditLogPagedResponse> {
    const requestBody: AuditFilterRequest = {};
    
    if (filter) {
      if (filter.userId) requestBody.userId = filter.userId;
      if (filter.action !== undefined) requestBody.action = filter.action;
      if (filter.startDate) requestBody.startDate = filter.startDate.toISOString();
      if (filter.endDate) requestBody.endDate = filter.endDate.toISOString();
      if (filter.page !== undefined) requestBody.page = filter.page;
      if (filter.pageSize !== undefined) requestBody.pageSize = filter.pageSize;
    }

    return this.http.post<AuditLogPagedResponse>(`${this.apiUrl}/logs`, requestBody);
  }

  /**
   * Export audit logs to file
   * API endpoint: POST /api/Audit/export
   */
  export(filter?: AuditLogFilter): Observable<Blob> {
    const requestBody: AuditFilterRequest = {};
    
    if (filter) {
      if (filter.userId) requestBody.userId = filter.userId;
      if (filter.action !== undefined) requestBody.action = filter.action;
      if (filter.startDate) requestBody.startDate = filter.startDate.toISOString();
      if (filter.endDate) requestBody.endDate = filter.endDate.toISOString();
    }

    return this.http.post(`${this.apiUrl}/export`, requestBody, { 
      responseType: 'blob' 
    });
  }
}

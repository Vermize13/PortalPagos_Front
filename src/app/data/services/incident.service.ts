import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Incident,
  IncidentWithDetails,
  IncidentStatus,
  IncidentPriority,
  IncidentSeverity,
  IncidentHistory
} from '../../domain/models';

export interface IncidentFilter {
  projectId?: string;
  sprintId?: string;
  status?: IncidentStatus;
  priority?: IncidentPriority;
  severity?: IncidentSeverity;
  assigneeId?: string;
  reporterId?: string;
}

export interface CreateIncidentRequest {
  projectId: string;
  sprintId?: string;
  title: string;
  description?: string;
  testData?: string;
  evidence?: string;
  expectedBehavior?: string;
  bugType?: number;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  assigneeId?: string;
  storyPoints?: number;
  dueDate?: string;
  labelIds?: string[];
}

export interface UpdateIncidentRequest {
  title?: string;
  description?: string;
  testData?: string;
  evidence?: string;
  expectedBehavior?: string;
  bugType?: number;
  severity?: IncidentSeverity;
  priority?: IncidentPriority;
  status?: IncidentStatus;
  sprintId?: string;
  assigneeId?: string;
  storyPoints?: number;
  dueDate?: string;
}

export interface AddCommentRequest {
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private readonly apiUrl = `${environment.url}api/Incidents`;

  constructor(private http: HttpClient) { }

  getAll(filter?: IncidentFilter): Observable<IncidentWithDetails[]> {
    let params = new HttpParams();
    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<IncidentWithDetails[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<IncidentWithDetails> {
    return this.http.get<IncidentWithDetails>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateIncidentRequest): Observable<Incident> {
    return this.http.post<Incident>(this.apiUrl, request);
  }

  update(id: string, request: UpdateIncidentRequest): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/${id}`, request);
  }

  assign(id: string, assigneeId: string): Observable<Incident> {
    return this.http.post<Incident>(`${this.apiUrl}/${id}/assign/${assigneeId}`, {});
  }

  close(id: string): Observable<Incident> {
    return this.http.post<Incident>(`${this.apiUrl}/${id}/close`, {});
  }

  getHistory(id: string): Observable<IncidentHistory[]> {
    return this.http.get<IncidentHistory[]>(`${this.apiUrl}/${id}/history`);
  }

  getComments(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/comments`);
  }

  addComment(id: string, request: AddCommentRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/comments`, request);
  }

  addLabel(id: string, labelId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/labels/${labelId}`, {});
  }

  removeLabel(id: string, labelId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/labels/${labelId}`);
  }
}

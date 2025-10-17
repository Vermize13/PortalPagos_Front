import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Incident, 
  IncidentWithDetails, 
  IncidentStatus, 
  IncidentPriority, 
  IncidentSeverity 
} from '../../domain/models';

export interface IncidentFilter {
  projectId?: number;
  sprintId?: number;
  status?: IncidentStatus;
  priority?: IncidentPriority;
  severity?: IncidentSeverity;
  assignedToId?: number;
  reportedById?: number;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private readonly apiUrl = `${environment.url}api/incidents`;

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

  getById(id: number): Observable<IncidentWithDetails> {
    return this.http.get<IncidentWithDetails>(`${this.apiUrl}/${id}`);
  }

  create(incident: Partial<Incident>): Observable<Incident> {
    return this.http.post<Incident>(this.apiUrl, incident);
  }

  update(id: number, incident: Partial<Incident>): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}/${id}`, incident);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: IncidentStatus): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { status });
  }

  assign(id: number, userId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/assign`, { userId });
  }

  addTag(id: number, tag: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/tags`, { tag });
  }

  removeTag(id: number, tag: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/tags/${tag}`);
  }

  getMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/metrics`);
  }
}

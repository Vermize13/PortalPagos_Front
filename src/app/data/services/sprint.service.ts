import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sprint, SprintWithProject } from '../../domain/models';

export interface CreateSprintRequest {
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  private readonly apiUrl = `${environment.url}api/Sprints`;

  constructor(private http: HttpClient) { }

  getById(id: string): Observable<Sprint> {
    return this.http.get<Sprint>(`${this.apiUrl}/${id}`);
  }

  getByProject(projectId: string): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.apiUrl}/by-project/${projectId}`);
  }

  create(projectId: string, request: CreateSprintRequest): Observable<Sprint> {
    return this.http.post<Sprint>(`${this.apiUrl}/by-project/${projectId}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  close(id: string): Observable<Sprint> {
    return this.http.patch<Sprint>(`${this.apiUrl}/${id}/close`, {});
  }
}

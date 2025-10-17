import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Project, ProjectWithMembers, ProjectMemberDetail } from '../../domain/models';

export interface CreateProjectRequest {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface AddProjectMemberRequest {
  userId: string;
  roleId: string;
}

export interface ProjectProgressResponse {
  projectId: string;
  projectName?: string;
  totalSprints: number;
  activeSprints: number;
  closedSprints: number;
  totalIncidents: number;
  openIncidents: number;
  inProgressIncidents: number;
  closedIncidents: number;
  totalMembers: number;
  activeMembers: number;
  completionPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = `${environment.url}api/Projects`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getById(id: string): Observable<ProjectWithMembers> {
    return this.http.get<ProjectWithMembers>(`${this.apiUrl}/${id}`);
  }

  getByCode(code: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/by-code/${code}`);
  }

  create(request: CreateProjectRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, request);
  }

  update(id: string, request: UpdateProjectRequest): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMembers(projectId: string): Observable<ProjectMemberDetail[]> {
    return this.http.get<ProjectMemberDetail[]>(`${this.apiUrl}/${projectId}/members`);
  }

  addMember(projectId: string, request: AddProjectMemberRequest): Observable<ProjectMemberDetail> {
    return this.http.post<ProjectMemberDetail>(`${this.apiUrl}/${projectId}/members`, request);
  }

  removeMember(projectId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/members/${userId}`);
  }

  getProgress(id: string): Observable<ProjectProgressResponse> {
    return this.http.get<ProjectProgressResponse>(`${this.apiUrl}/${id}/progress`);
  }
}

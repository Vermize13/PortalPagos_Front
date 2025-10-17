import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Project, ProjectWithMembers, ProjectMemberDetail } from '../../domain/models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly apiUrl = `${environment.url}api/projects`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getById(id: number): Observable<ProjectWithMembers> {
    return this.http.get<ProjectWithMembers>(`${this.apiUrl}/${id}`);
  }

  create(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  update(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMembers(projectId: number): Observable<ProjectMemberDetail[]> {
    return this.http.get<ProjectMemberDetail[]>(`${this.apiUrl}/${projectId}/members`);
  }

  addMember(projectId: number, userId: number, role: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${projectId}/members`, { userId, role });
  }

  removeMember(projectId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/members/${userId}`);
  }
}

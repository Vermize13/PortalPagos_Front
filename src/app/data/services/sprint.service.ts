import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sprint, SprintWithProject } from '../../domain/models';

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  private readonly apiUrl = `${environment.url}api/sprints`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<SprintWithProject[]> {
    return this.http.get<SprintWithProject[]>(this.apiUrl);
  }

  getById(id: number): Observable<Sprint> {
    return this.http.get<Sprint>(`${this.apiUrl}/${id}`);
  }

  getByProject(projectId: number): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.apiUrl}/project/${projectId}`);
  }

  create(sprint: Partial<Sprint>): Observable<Sprint> {
    return this.http.post<Sprint>(this.apiUrl, sprint);
  }

  update(id: number, sprint: Partial<Sprint>): Observable<Sprint> {
    return this.http.put<Sprint>(`${this.apiUrl}/${id}`, sprint);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

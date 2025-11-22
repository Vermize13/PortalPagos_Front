import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Label } from '../../domain/models';

export interface CreateLabelRequest {
  projectId: string;
  name: string;
  colorHex?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private readonly apiUrl = `${environment.url}api`;

  constructor(private http: HttpClient) { }

  /**
   * Get all labels for a specific project
   * API endpoint: GET /api/Labels/project/{projectId}
   */
  getByProject(projectId: string): Observable<Label[]> {
    return this.http.get<Label[]>(`${this.apiUrl}/Labels/project/${projectId}`);
  }

  /**
   * Create a new label for a project
   * API endpoint: POST /api/Labels
   */
  create(request: CreateLabelRequest): Observable<Label> {
    return this.http.post<Label>(`${this.apiUrl}/Labels`, request);
  }
}

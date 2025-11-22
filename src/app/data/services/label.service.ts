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
   * Note: This endpoint may not exist in the API yet. 
   * If it doesn't exist, we'll need to get labels from incidents or projects.
   * For now, we'll return mock data based on the project.
   */
  getByProject(projectId: string): Observable<Label[]> {
    // TODO: Replace with actual API call when endpoint is available
    // return this.http.get<Label[]>(`${this.apiUrl}/Projects/${projectId}/labels`);
    
    // Mock data for now - in production this should call the API
    return of(this.getMockLabels(projectId));
  }

  /**
   * Create a new label for a project
   */
  create(request: CreateLabelRequest): Observable<Label> {
    // TODO: Implement when API endpoint is available
    // return this.http.post<Label>(`${this.apiUrl}/Projects/${request.projectId}/labels`, request);
    return of({
      id: crypto.randomUUID(),
      projectId: request.projectId,
      project: null,
      name: request.name,
      colorHex: request.colorHex
    });
  }

  /**
   * Mock labels for demonstration
   * In production, this should be removed and use the actual API
   */
  private getMockLabels(projectId: string): Label[] {
    return [
      { id: '123e4567-e89b-12d3-a456-426614174000', projectId, project: null, name: 'Bug', colorHex: '#dc3545' },
      { id: '123e4567-e89b-12d3-a456-426614174001', projectId, project: null, name: 'Urgente', colorHex: '#ff6b6b' },
      { id: '123e4567-e89b-12d3-a456-426614174002', projectId, project: null, name: 'Performance', colorHex: '#ffc107' },
      { id: '123e4567-e89b-12d3-a456-426614174003', projectId, project: null, name: 'Feature', colorHex: '#28a745' },
      { id: '123e4567-e89b-12d3-a456-426614174004', projectId, project: null, name: 'UI/UX', colorHex: '#17a2b8' },
      { id: '123e4567-e89b-12d3-a456-426614174005', projectId, project: null, name: 'Documentación', colorHex: '#6c757d' },
      { id: '123e4567-e89b-12d3-a456-426614174006', projectId, project: null, name: 'Seguridad', colorHex: '#e83e8c' },
      { id: '123e4567-e89b-12d3-a456-426614174007', projectId, project: null, name: 'Refactorización', colorHex: '#6610f2' },
    ];
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Attachment, AttachmentWithUser } from '../../domain/models';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private readonly apiUrl = `${environment.url}api/attachments`;

  constructor(private http: HttpClient) { }

  getByIncident(incidentId: number): Observable<AttachmentWithUser[]> {
    return this.http.get<AttachmentWithUser[]>(`${this.apiUrl}/incident/${incidentId}`);
  }

  upload(incidentId: number, file: File): Observable<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('incidentId', incidentId.toString());
    
    return this.http.post<Attachment>(`${this.apiUrl}/upload`, formData);
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, { 
      responseType: 'blob' 
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

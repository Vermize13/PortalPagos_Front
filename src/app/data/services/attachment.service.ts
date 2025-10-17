import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Attachment, AttachmentWithUser } from '../../domain/models';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private readonly baseUrl = `${environment.url}api/incidents`;

  constructor(private http: HttpClient) { }

  getByIncident(incidentId: string): Observable<AttachmentWithUser[]> {
    return this.http.get<AttachmentWithUser[]>(`${this.baseUrl}/${incidentId}/attachments`);
  }

  getById(incidentId: string, id: string): Observable<Attachment> {
    return this.http.get<Attachment>(`${this.baseUrl}/${incidentId}/attachments/${id}`);
  }

  upload(incidentId: string, file: File): Observable<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<Attachment>(`${this.baseUrl}/${incidentId}/attachments`, formData);
  }

  download(incidentId: string, id: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${incidentId}/attachments/${id}/download`, { 
      responseType: 'blob' 
    });
  }

  delete(incidentId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${incidentId}/attachments/${id}`);
  }
}

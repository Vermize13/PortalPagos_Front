import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Attachment, AttachmentWithUser } from '../../domain/models';

export interface AttachmentValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * RF6.4 and RF6.5: Attachment Service with file size validation
 */
@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private readonly baseUrl = `${environment.url}api/incidents`;
  
  // RF6.5: Maximum file size in bytes (default: 10MB)
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  // Allowed file types
  private readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-rar-compressed',
    'text/markdown'
  ];

  constructor(private http: HttpClient) { }

  getByIncident(incidentId: string): Observable<AttachmentWithUser[]> {
    return this.http.get<AttachmentWithUser[]>(`${this.baseUrl}/${incidentId}/attachments`);
  }

  getById(incidentId: string, id: string): Observable<Attachment> {
    return this.http.get<Attachment>(`${this.baseUrl}/${incidentId}/attachments/${id}`);
  }

  /**
   * RF6.5: Validate file before upload
   */
  validateFile(file: File): AttachmentValidationResult {
    // Check if file exists
    if (!file) {
      return { valid: false, error: 'No se ha seleccionado ningún archivo' };
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      const maxSizeMB = this.MAX_FILE_SIZE / (1024 * 1024);
      return { 
        valid: false, 
        error: `El archivo excede el tamaño máximo permitido de ${maxSizeMB}MB` 
      };
    }

    // Infer file type from extension if type is empty
    const fileType = file.type || this.inferFileType(file.name);
    console.log('Validating file type:', file);
    if (!this.ALLOWED_TYPES.includes(fileType)) {
      return { 
        valid: false, 
        error: 'Tipo de archivo no permitido. Por favor, sube una imagen, documento o archivo comprimido.' 
      };
    }

    return { valid: true };
  }

  private inferFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) {
      return '';
    }

    const extensionToTypeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'txt': 'text/plain',
      'csv': 'text/csv',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      'md': 'text/markdown'
    };

    return extensionToTypeMap[extension] || '';
  }

  /**
   * RF6.4: Upload file with validation
   */
  upload(incidentId: string, file: File): Observable<Attachment> {
    // RF6.5: Validate file before upload
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return throwError(() => new Error(validation.error));
    }

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

  /**
   * Get max file size in MB for display
   */
  getMaxFileSizeMB(): number {
    return this.MAX_FILE_SIZE / (1024 * 1024);
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

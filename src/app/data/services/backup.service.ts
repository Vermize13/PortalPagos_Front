import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BackupRequest {
  notes?: string;
}

export interface BackupResponse {
  id: string;
  createdBy: string;
  creatorName?: string;
  storagePath?: string;
  strategy?: string;
  sizeBytes?: number;
  status?: string;
  startedAt: Date;
  finishedAt?: Date;
  notes?: string;
}

export interface RestoreRequest {
  backupId: string;
  notes?: string;
}

export interface RestoreResponse {
  id: string;
  backupId: string;
  requestedBy: string;
  requesterName?: string;
  status?: string;
  targetDb?: string;
  startedAt: Date;
  finishedAt?: Date;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private readonly apiUrl = `${environment.url}api/Backup`;

  constructor(private http: HttpClient) { }

  createBackup(request: BackupRequest): Observable<BackupResponse> {
    return this.http.post<BackupResponse>(this.apiUrl, request);
  }

  getAllBackups(): Observable<BackupResponse[]> {
    return this.http.get<BackupResponse[]>(this.apiUrl);
  }

  getBackupById(id: string): Observable<BackupResponse> {
    return this.http.get<BackupResponse>(`${this.apiUrl}/${id}`);
  }

  restoreBackup(request: RestoreRequest): Observable<RestoreResponse> {
    return this.http.post<RestoreResponse>(`${this.apiUrl}/restore`, request);
  }

  getRestoreById(id: string): Observable<RestoreResponse> {
    return this.http.get<RestoreResponse>(`${this.apiUrl}/restore/${id}`);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { BackupService, BackupResponse, RestoreResponse } from '../../../data/services/backup.service';
import { ToastService } from '../../../data/services/toast.service';

/**
 * RF6.1 and RF6.2: Backup and Restore Administration
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextareaModule,
    DialogModule,
    TagModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  backups: BackupResponse[] = [];
  loading: boolean = false;
  
  // Create backup dialog
  showCreateDialog: boolean = false;
  backupNotes: string = '';
  
  // Restore dialog
  showRestoreDialog: boolean = false;
  selectedBackup: BackupResponse | null = null;
  restoreNotes: string = '';

  constructor(
    private backupService: BackupService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadBackups();
  }

  loadBackups() {
    this.loading = true;
    this.backupService.getAllBackups().subscribe({
      next: (backups) => {
        this.backups = backups.sort((a, b) => 
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading backups:', error);
        this.toastService.Error('Error', 'No se pudieron cargar las copias de seguridad');
        this.loading = false;
      }
    });
  }

  // RF6.1: Create backup
  openCreateDialog() {
    this.backupNotes = '';
    this.showCreateDialog = true;
  }

  createBackup() {
    if (!this.backupNotes.trim()) {
      this.toastService.Warn('Advertencia', 'Por favor, ingrese notas para la copia de seguridad');
      return;
    }

    this.loading = true;
    this.backupService.createBackup({ notes: this.backupNotes }).subscribe({
      next: (backup) => {
        this.toastService.Success('Éxito', 'Copia de seguridad creada correctamente');
        this.showCreateDialog = false;
        this.loadBackups();
      },
      error: (error) => {
        console.error('Error creating backup:', error);
        this.toastService.Error('Error', 'No se pudo crear la copia de seguridad');
        this.loading = false;
      }
    });
  }

  // RF6.2: Restore backup
  openRestoreDialog(backup: BackupResponse) {
    this.selectedBackup = backup;
    this.restoreNotes = '';
    this.showRestoreDialog = true;
  }

  restoreBackup() {
    if (!this.selectedBackup) return;

    this.loading = true;
    this.backupService.restoreBackup({
      backupId: this.selectedBackup.id,
      notes: this.restoreNotes
    }).subscribe({
      next: (restore) => {
        this.toastService.Success('Éxito', 'Restauración iniciada correctamente');
        this.showRestoreDialog = false;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error restoring backup:', error);
        this.toastService.Error('Error', 'No se pudo restaurar la copia de seguridad');
        this.loading = false;
      }
    });
  }

  getStatusSeverity(status?: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'success';
      case 'in_progress':
      case 'running':
        return 'info';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'error':
        return 'danger';
      default:
        return 'info';
    }
  }

  formatBytes(bytes?: number): string {
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getDuration(startedAt: Date, finishedAt?: Date): string {
    const start = new Date(startedAt).getTime();
    const end = finishedAt ? new Date(finishedAt).getTime() : Date.now();
    const diff = end - start;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

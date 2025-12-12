import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { BackupService, BackupResponse, RestoreResponse } from '../../../data/services/backup.service';
import { ToastService } from '../../../data/services/toast.service';
import { PermissionService } from '../../../data/services/permission.service';
import { Permissions } from '../../../domain/models';

/**
 * RF6: System Administration - Backup & Restore and Configuration
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
    TagModule,
    TabViewModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    TooltipModule,
    AccordionModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  // Active tab index
  activeTabIndex: number = 0;
  
  // Help manual visibility
  showHelpManual: boolean = false;
  
  // Backup & Restore properties
  backups: BackupResponse[] = [];
  loading: boolean = false;
  
  // Create backup dialog
  showCreateDialog: boolean = false;
  backupNotes: string = '';
  
  // Restore dialog
  showRestoreDialog: boolean = false;
  selectedBackup: BackupResponse | null = null;
  restoreNotes: string = '';

  // Configuration properties
  systemConfig = {
    systemName: 'Martiniere Ticket Management System',
    maxUploadSize: '10',
    sessionTimeout: '30',
    backupRetentionDays: '30',
    emailNotifications: true,
    maintenanceMode: false
  };
  
  uploadSizeOptions = [
    { label: '5 MB', value: '5' },
    { label: '10 MB', value: '10' },
    { label: '25 MB', value: '25' },
    { label: '50 MB', value: '50' },
    { label: '100 MB', value: '100' }
  ];
  
  sessionTimeoutOptions = [
    { label: '15 minutos', value: '15' },
    { label: '30 minutos', value: '30' },
    { label: '60 minutos', value: '60' },
    { label: '120 minutos', value: '120' }
  ];
  
  retentionOptions = [
    { label: '7 días', value: '7' },
    { label: '15 días', value: '15' },
    { label: '30 días', value: '30' },
    { label: '60 días', value: '60' },
    { label: '90 días', value: '90' }
  ];
  
  configModified: boolean = false;

  constructor(
    private backupService: BackupService,
    private toastService: ToastService,
    public permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.loadBackups();
    this.loadConfiguration();
  }

  // Permission helper methods for template use
  canCreateBackup(): boolean {
    return this.permissionService.hasPermission(Permissions.BACKUP_CREATE) ||
           this.permissionService.hasPermission(Permissions.ADMIN_FULL);
  }

  canRestoreBackup(): boolean {
    return this.permissionService.hasPermission(Permissions.BACKUP_RESTORE) ||
           this.permissionService.hasPermission(Permissions.ADMIN_FULL);
  }

  canViewBackups(): boolean {
    return this.permissionService.hasPermission(Permissions.BACKUP_VIEW) ||
           this.permissionService.hasPermission(Permissions.ADMIN_ACCESS) ||
           this.permissionService.hasPermission(Permissions.ADMIN_FULL);
  }

  canConfigureSystem(): boolean {
    return this.permissionService.hasPermission(Permissions.ADMIN_FULL);
  }

  loadBackups() {
    this.loading = true;
    this.backupService.getAllBackups().subscribe({
      next: (backups) => {
        // Ensure backups is an array before calling sort
        const backupsArray = Array.isArray(backups) ? backups : [];
        this.backups = backupsArray.sort((a, b) => 
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading backups:', error);
        this.toastService.showError('Error', 'No se pudieron cargar las copias de seguridad');
        this.backups = [];
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
      this.toastService.showWarn('Advertencia', 'Por favor, ingrese notas para la copia de seguridad');
      return;
    }

    this.loading = true;
    this.backupService.createBackup({ notes: this.backupNotes }).subscribe({
      next: (backup) => {
        this.toastService.showSuccess('Éxito', 'Copia de seguridad creada correctamente');
        this.showCreateDialog = false;
        this.loadBackups();
      },
      error: (error) => {
        console.error('Error creating backup:', error);
        this.toastService.showError('Error', 'No se pudo crear la copia de seguridad');
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
        this.toastService.showSuccess('Éxito', 'Restauración iniciada correctamente');
        this.showRestoreDialog = false;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error restoring backup:', error);
        this.toastService.showError('Error', 'No se pudo restaurar la copia de seguridad');
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

  // Configuration methods
  loadConfiguration() {
    // Load configuration from localStorage or API
    const savedConfig = localStorage.getItem('systemConfig');
    if (savedConfig) {
      this.systemConfig = JSON.parse(savedConfig);
    }
  }

  onConfigChange() {
    this.configModified = true;
  }

  saveConfiguration() {
    // Save configuration to localStorage and/or API
    localStorage.setItem('systemConfig', JSON.stringify(this.systemConfig));
    this.toastService.showSuccess('Éxito', 'Configuración guardada correctamente');
    this.configModified = false;
  }

  resetConfiguration() {
    // Reset to default values
    this.systemConfig = {
      systemName: 'Martiniere Ticket Management System',
      maxUploadSize: '10',
      sessionTimeout: '30',
      backupRetentionDays: '30',
      emailNotifications: true,
      maintenanceMode: false
    };
    this.configModified = true;
    this.toastService.showInfo('Información', 'Configuración restablecida a valores predeterminados');
  }
}

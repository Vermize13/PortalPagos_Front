import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { 
  Incident, 
  IncidentStatus, 
  IncidentPriority, 
  IncidentSeverity,
  IncidentComment,
  LabelInfo,
  Label,
  IncidentWithDetails,
  IncidentHistory,
  Permissions
} from '../../../domain/models';
import { IncidentService, AddCommentRequest } from '../../../data/services/incident.service';
import { AttachmentService } from '../../../data/services/attachment.service';
import { LabelService } from '../../../data/services/label.service';
import { AttachmentWithUser } from '../../../domain/models/attachment.model';
import { ToastService } from '../../../data/services/toast.service';
import { PermissionService } from '../../../data/services/permission.service';
import { IncidentPriorityMapping, IncidentSeverityMapping, IncidentStatusMapping } from '../../../domain/models/enum-mappings';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    InputTextareaModule,
    DividerModule,
    AvatarModule,
    TabViewModule,
    TableModule,
    FileUploadModule,
    TooltipModule,
    DialogModule,
    MultiSelectModule
  ],
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.css']
})
export class IncidentDetailComponent implements OnInit {
  incident: IncidentWithDetails | null = null;
  comments: IncidentComment[] = [];
  history: IncidentHistory[] = [];
  attachments: AttachmentWithUser[] = [];
  loading: boolean = false;
  loadingComments: boolean = false;
  loadingHistory: boolean = false;
  loadingAttachments: boolean = false;
  newCommentBody: string = '';
  submittingComment: boolean = false;
  uploadingAttachment: boolean = false;
  
  // Label management
  displayLabelDialog: boolean = false;
  availableLabels: Label[] = [];
  selectedLabelIds: string[] = [];
  loadingLabels: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService,
    private attachmentService: AttachmentService,
    private labelService: LabelService,
    private toastService: ToastService,
    public permissionService: PermissionService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIncident(id);
      this.loadComments(id);
      this.loadHistory(id);
      this.loadAttachments(id);
    }
  }

  // Permission helper methods for template use
  canEditIncident(): boolean {
    return this.permissionService.canUpdateIncidentTitle() ||
           this.permissionService.canUpdateIncidentDescription() ||
           this.permissionService.canUpdateIncidentLabels() ||
           this.permissionService.canUpdateIncidentData();
  }

  canManageLabels(): boolean {
    return this.permissionService.canUpdateIncidentLabels();
  }

  canComment(): boolean {
    return this.permissionService.hasPermission(Permissions.INCIDENT_COMMENT);
  }

  canManageAttachments(): boolean {
    return this.permissionService.hasPermission(Permissions.INCIDENT_ATTACHMENT);
  }

  loadIncident(id: string) {
    this.loading = true;
    this.incidentService.getById(id).subscribe({
      next: (incident) => {
        this.incident = incident;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading incident:', error);
        this.toastService.showError('Error', 'No se pudo cargar la incidencia');
        this.loading = false;
        this.router.navigate(['/inicio/incidents']);
      }
    });
  }

  loadComments(id: string) {
    this.loadingComments = true;
    this.incidentService.getComments(id).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.loadingComments = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.toastService.showError('Error', 'No se pudieron cargar los comentarios');
        this.loadingComments = false;
      }
    });
  }

  loadHistory(id: string) {
    this.loadingHistory = true;
    this.incidentService.getHistory(id).subscribe({
      next: (history) => {
        this.history = history;
        this.loadingHistory = false;
      },
      error: (error) => {
        console.error('Error loading history:', error);
        this.toastService.showError('Error', 'No se pudo cargar el historial');
        this.loadingHistory = false;
      }
    });
  }

  loadAttachments(id: string) {
    this.loadingAttachments = true;
    this.attachmentService.getByIncident(id).subscribe({
      next: (attachments) => {
        this.attachments = attachments;
        this.loadingAttachments = false;
      },
      error: (error) => {
        console.error('Error loading attachments:', error);
        this.toastService.showError('Error', 'No se pudieron cargar los adjuntos');
        this.loadingAttachments = false;
      }
    });
  }

  onAddComment() {
    if (!this.newCommentBody.trim() || !this.incident) {
      return;
    }

    this.submittingComment = true;
    const request: AddCommentRequest = {
      body: this.newCommentBody.trim()
    };

    this.incidentService.addComment(this.incident.id, request).subscribe({
      next: () => {
        this.toastService.showSuccess('Éxito', 'Comentario agregado correctamente');
        this.newCommentBody = '';
        this.loadComments(this.incident!.id);
        this.submittingComment = false;
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.toastService.showError('Error', 'No se pudo agregar el comentario');
        this.submittingComment = false;
      }
    });
  }

  onFileSelect(event: any) {
    console.log('File select event:', event.files);
    if (!this.incident) return;

    const file = event.files?.[0];
    if (!file) return;

    const validation = this.attachmentService.validateFile(file);
    console.log('File validation result:', validation);
    if (!validation.valid) {
      this.toastService.showError('Error', validation.error || 'Archivo no válido');
      if (event.target?.clear) {
        event.target.clear();
      }
      return;
    }

    const incidentId = this.incident.id;
    
    this.uploadingAttachment = true;
    this.attachmentService.upload(incidentId, file).subscribe({
      next: () => {
        this.toastService.showSuccess('Éxito', 'Archivo subido correctamente');
      },
      error: () => {
        this.toastService.showError('Error', 'No se pudo subir el archivo');
      },
      complete: () => {
        this.uploadingAttachment = false;
      }
    });
  }

  onDownloadAttachment(attachment: AttachmentWithUser) {
    if (!this.incident) return;

    this.attachmentService.download(this.incident.id, attachment.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = attachment.fileName;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastService.showSuccess('Éxito', 'Archivo descargado');
      },
      error: (error) => {
        console.error('Error downloading file:', error);
        this.toastService.showError('Error', 'No se pudo descargar el archivo');
      }
    });
  }

  onDeleteAttachment(attachment: AttachmentWithUser) {
    if (!this.incident) return;

    if (!confirm(`¿Está seguro de eliminar el archivo "${attachment.fileName}"?`)) {
      return;
    }

    const incidentId = this.incident.id;
    this.attachmentService.delete(incidentId, attachment.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Éxito', 'Archivo eliminado correctamente');
        this.loadAttachments(incidentId);
      },
      error: (error) => {
        console.error('Error deleting file:', error);
        this.toastService.showError('Error', 'No se pudo eliminar el archivo');
      }
    });
  }

  formatFileSize(bytes: number): string {
    return this.attachmentService.formatFileSize(bytes);
  }

  getMaxFileSizeMB(): number {
    return this.attachmentService.getMaxFileSizeMB();
  }

  onBack() {
    this.router.navigate(['/inicio/incidents']);
  }

  onEdit() {
    if (this.incident) {
      this.router.navigate(['/inicio/incidents'], { 
        queryParams: { edit: this.incident.id } 
      });
    }
  }

  getStatusSeverity(status: IncidentStatus): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case IncidentStatus.Abierto: return 'info';
      case IncidentStatus.EnProgreso: return 'warning';
      case IncidentStatus.Resuelto: return 'success';
      case IncidentStatus.Cerrado: return 'secondary';
      case IncidentStatus.Rechazado: return 'danger';
      case IncidentStatus.Duplicado: return 'secondary';
      default: return 'info';
    }
  }

  getPrioritySeverity(priority: IncidentPriority): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (priority) {
      case IncidentPriority.NoHacer: return 'secondary';
      case IncidentPriority.PodríaHacer: return 'success';
      case IncidentPriority.DeberíaHacer: return 'info';
      case IncidentPriority.DebeHacer: return 'danger';
      default: return 'info';
    }
  }

  getSeveritySeverity(severity: IncidentSeverity): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (severity) {
      case IncidentSeverity.Bajo: return 'success';
      case IncidentSeverity.Medio: return 'info';
      case IncidentSeverity.Alto: return 'warning';
      case IncidentSeverity.Crítico: return 'danger';
      default: return 'info';
    }
  }

  getStatusLabel(status: IncidentStatus): string {
    return IncidentStatusMapping.find(s => s.value === status)?.label ?? 'Desconocido';
  }

  getPriorityLabel(priority: IncidentPriority): string {
    return IncidentPriorityMapping.find(p => p.value === priority)?.label ?? 'Desconocido';
  }

  getSeverityLabel(severity: IncidentSeverity): string {
    return IncidentSeverityMapping.find(s => s.value === severity)?.label ?? 'Desconocido';
  }

  getAuthorInitials(authorName: string): string {
    if (!authorName || !authorName.trim()) return '?';
    const names = authorName.trim().split(' ').filter(n => n.length > 0);
    if (names.length >= 2 && names[0][0] && names[1][0]) {
      return names[0][0].toUpperCase() + names[1][0].toUpperCase();
    }
    if (names.length > 0 && names[0].length >= 2) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return authorName.substring(0, 2).toUpperCase();
  }

  // Field name translations for history
  getFieldNameInSpanish(fieldName: string): string {
    const fieldMappings: { [key: string]: string } = {
      'Status': 'Estado',
      'Priority': 'Prioridad',
      'Severity': 'Severidad',
      'Title': 'Título',
      'Description': 'Descripción',
      'DueDate': 'Fecha límite',
      'AssigneeId': 'Asignado a',
      'SprintId': 'Sprint',
      'StoryPoints': 'Puntos de historia',
      'ClosedAt': 'Fecha de cierre'
    };
    return fieldMappings[fieldName] || fieldName;
  }

  // Transform history values to Spanish
  getHistoryValueInSpanish(fieldName: string, value: string | null | undefined): string {
    if (!value || value === '-') return '-';

    // Handle Status enum
    if (fieldName === 'Status') {
      // Try parsing as numeric value first
      const statusValue = parseInt(value, 10);
      if (!isNaN(statusValue)) {
        const statusMapping = IncidentStatusMapping.find(s => s.value === statusValue);
        return statusMapping?.label || value;
      }
      // Handle string values - backend may return C# enum names in English
      const statusStringMappings: { [key: string]: string } = {
        'Open': 'Abierto',
        'Abierto': 'Abierto',
        'InProgress': 'En Progreso',
        'EnProgreso': 'En Progreso',
        'Resolved': 'Resuelto',
        'Resuelto': 'Resuelto',
        'Closed': 'Cerrado',
        'Cerrado': 'Cerrado',
        'Rejected': 'Rechazado',
        'Rechazado': 'Rechazado',
        'Duplicate': 'Duplicado',
        'Duplicado': 'Duplicado'
      };
      return statusStringMappings[value] || value;
    }

    // Handle Priority enum
    if (fieldName === 'Priority') {
      // Try parsing as numeric value first
      const priorityValue = parseInt(value, 10);
      if (!isNaN(priorityValue)) {
        const priorityMapping = IncidentPriorityMapping.find(p => p.value === priorityValue);
        return priorityMapping?.label || value;
      }
      // Handle string values - backend may return C# enum names
      const priorityStringMappings: { [key: string]: string } = {
        'NoHacer': 'No necesario',
        'MustNotHave': 'No necesario',
        'PodríaHacer': 'Podría tener',
        'CouldHave': 'Podría tener',
        'DeberíaHacer': 'Debería tener',
        'ShouldHave': 'Debería tener',
        'DebeHacer': 'Debe tener',
        'MustHave': 'Debe tener'
      };
      return priorityStringMappings[value] || value;
    }

    // Handle Severity enum
    if (fieldName === 'Severity') {
      // Try parsing as numeric value first
      const severityValue = parseInt(value, 10);
      if (!isNaN(severityValue)) {
        const severityMapping = IncidentSeverityMapping.find(s => s.value === severityValue);
        return severityMapping?.label || value;
      }
      // Handle string values - backend may return C# enum names
      // Note: Using feminine forms (Baja, Media, Alta, Crítica) to match "severidad" (feminine noun)
      const severityStringMappings: { [key: string]: string } = {
        'Low': 'Baja',
        'Bajo': 'Baja',
        'Medium': 'Media',
        'Medio': 'Media',
        'High': 'Alta',
        'Alto': 'Alta',
        'Critical': 'Crítica',
        'Crítico': 'Crítica',
        'Critico': 'Crítica' // Handle without accent
      };
      return severityStringMappings[value] || value;
    }

    return value;
  }

  // Get the user name from history change
  getHistoryUserName(change: IncidentHistory): string {
    return change.changedByUser?.name || 'Usuario';
  }

  onManageLabels() {
    if (!this.incident) return;
    
    this.selectedLabelIds = Array.isArray(this.incident.labels) ? this.incident.labels.map(l => l.id) : [];
    this.loadingLabels = true;
    
    this.labelService.getByProject(this.incident.projectId).subscribe({
      next: (labels) => {
        this.availableLabels = labels;
        this.loadingLabels = false;
        this.displayLabelDialog = true;
      },
      error: (error) => {
        console.error('Error loading labels:', error);
        this.toastService.showError('Error', 'No se pudieron cargar las etiquetas');
        this.loadingLabels = false;
      }
    });
  }

  onSaveLabels() {
    if (!this.incident) return;

    const currentLabelIds = Array.isArray(this.incident.labels) ? this.incident.labels.map(l => l.id) : [];
    const labelsToAdd = this.selectedLabelIds.filter(id => !currentLabelIds.includes(id));
    const labelsToRemove = currentLabelIds.filter(id => !this.selectedLabelIds.includes(id));

    if (labelsToAdd.length === 0 && labelsToRemove.length === 0) {
      this.displayLabelDialog = false;
      return;
    }

    // Create arrays of observables for add and remove operations
    const addOperations = labelsToAdd.map(labelId =>
      this.incidentService.addLabel(this.incident!.id, labelId).pipe(
        catchError(error => {
          console.error('Error adding label:', error);
          return of(null); // Return null on error to continue with other operations
        })
      )
    );

    const removeOperations = labelsToRemove.map(labelId =>
      this.incidentService.removeLabel(this.incident!.id, labelId).pipe(
        catchError(error => {
          console.error('Error removing label:', error);
          return of(null); // Return null on error to continue with other operations
        })
      )
    );

    // Combine all operations
    const allOperations = [...addOperations, ...removeOperations];

    // Execute all operations in parallel
    forkJoin(allOperations).subscribe({
      next: (results) => {
        const hasErrors = results.some(result => result === null);
        if (hasErrors) {
          this.toastService.showError('Error', 'Algunas etiquetas no pudieron actualizarse');
        } else {
          this.toastService.showSuccess('Éxito', 'Etiquetas actualizadas correctamente');
        }
        this.displayLabelDialog = false;
        this.loadIncident(this.incident!.id);
      },
      error: (error) => {
        console.error('Error updating labels:', error);
        this.toastService.showError('Error', 'No se pudieron actualizar las etiquetas');
        this.displayLabelDialog = false;
      }
    });
  }

  onCancelLabelDialog() {
    this.displayLabelDialog = false;
  }
}

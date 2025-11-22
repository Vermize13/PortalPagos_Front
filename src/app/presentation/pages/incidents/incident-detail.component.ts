import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { 
  Incident, 
  IncidentStatus, 
  IncidentPriority, 
  IncidentSeverity,
  IncidentComment,
  LabelInfo,
  IncidentWithDetails,
  IncidentHistory
} from '../../../domain/models';
import { IncidentService, AddCommentRequest } from '../../../data/services/incident.service';
import { AttachmentService } from '../../../data/services/attachment.service';
import { AttachmentWithUser } from '../../../domain/models/attachment.model';
import { ToastService } from '../../../data/services/toast.service';
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
    TooltipModule
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService,
    private attachmentService: AttachmentService,
    private toastService: ToastService
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
    if (!this.incident) return;

    const file = event.files[0];
    if (!file) return;

    const validation = this.attachmentService.validateFile(file);
    if (!validation.valid) {
      this.toastService.showError('Error', validation.error || 'Archivo no válido');
      event.target.clear();
      return;
    }

    const incidentId = this.incident.id;
    this.uploadingAttachment = true;
    this.attachmentService.upload(incidentId, file).subscribe({
      next: () => {
        this.toastService.showSuccess('Éxito', 'Archivo subido correctamente');
        this.loadAttachments(incidentId);
        this.uploadingAttachment = false;
        event.target.clear();
      },
      error: (error) => {
        console.error('Error uploading file:', error);
        this.toastService.showError('Error', 'No se pudo subir el archivo');
        this.uploadingAttachment = false;
        event.target.clear();
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
}

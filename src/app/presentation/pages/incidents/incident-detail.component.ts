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
import { 
  Incident, 
  IncidentStatus, 
  IncidentPriority, 
  IncidentSeverity,
  IncidentComment
} from '../../../domain/models';
import { IncidentService, AddCommentRequest } from '../../../data/services/incident.service';
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
    AvatarModule
  ],
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.css']
})
export class IncidentDetailComponent implements OnInit {
  incident: Incident | null = null;
  comments: IncidentComment[] = [];
  loading: boolean = false;
  loadingComments: boolean = false;
  newCommentBody: string = '';
  submittingComment: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIncident(id);
      this.loadComments(id);
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

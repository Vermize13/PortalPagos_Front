import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { 
  IncidentWithDetails, 
  IncidentStatus, 
  IncidentPriority, 
  IncidentSeverity 
} from '../../../domain/models';

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule, DropdownModule, FormsModule],
  templateUrl: './incidents-list.component.html',
  styleUrls: ['./incidents-list.component.css']
})
export class IncidentsListComponent implements OnInit {
  incidents: IncidentWithDetails[] = [];
  loading: boolean = false;
  
  statuses = Object.values(IncidentStatus);
  priorities = Object.values(IncidentPriority);
  selectedStatus: string = '';

  ngOnInit() {
    this.loadIncidents();
  }

  loadIncidents() {
    this.loading = true;
    // Mock data for demonstration
    this.incidents = [
      {
        id: 1,
        projectId: 1,
        projectName: 'Portal de Pagos',
        sprintId: 1,
        sprintName: 'Sprint 1',
        title: 'Error en el formulario de login',
        description: 'El usuario no puede iniciar sesión',
        status: IncidentStatus.New,
        priority: IncidentPriority.High,
        severity: IncidentSeverity.Major,
        reportedById: 2,
        reportedByName: 'John Developer',
        assignedToId: 3,
        assignedToName: 'Jane Tester',
        createdAt: new Date('2024-03-01'),
        tags: ['bug', 'frontend'],
        attachmentCount: 2,
        commentCount: 5
      },
      {
        id: 2,
        projectId: 1,
        projectName: 'Portal de Pagos',
        title: 'Optimizar consulta de base de datos',
        description: 'Las consultas son muy lentas',
        status: IncidentStatus.InProgress,
        priority: IncidentPriority.Medium,
        severity: IncidentSeverity.Moderate,
        reportedById: 1,
        reportedByName: 'Admin User',
        assignedToId: 2,
        assignedToName: 'John Developer',
        createdAt: new Date('2024-03-05'),
        tags: ['performance', 'backend'],
        attachmentCount: 0,
        commentCount: 3
      },
      {
        id: 3,
        projectId: 2,
        projectName: 'Sistema de Incidencias',
        sprintId: 2,
        sprintName: 'Sprint 2',
        title: 'Implementar filtros avanzados',
        description: 'Añadir filtros por múltiples criterios',
        status: IncidentStatus.Resolved,
        priority: IncidentPriority.Low,
        severity: IncidentSeverity.Minor,
        reportedById: 1,
        reportedByName: 'Admin User',
        assignedToId: 2,
        assignedToName: 'John Developer',
        createdAt: new Date('2024-02-20'),
        resolvedAt: new Date('2024-03-10'),
        tags: ['feature', 'frontend'],
        attachmentCount: 1,
        commentCount: 8
      }
    ];
    this.loading = false;
  }

  getStatusSeverity(status: IncidentStatus): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case IncidentStatus.New: return 'info';
      case IncidentStatus.InProgress: return 'warning';
      case IncidentStatus.InReview: return 'secondary';
      case IncidentStatus.Resolved: return 'success';
      case IncidentStatus.Closed: return 'secondary';
      case IncidentStatus.Reopened: return 'danger';
      default: return 'info';
    }
  }

  getPrioritySeverity(priority: IncidentPriority): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (priority) {
      case IncidentPriority.Low: return 'success';
      case IncidentPriority.Medium: return 'info';
      case IncidentPriority.High: return 'warning';
      case IncidentPriority.Critical: return 'danger';
      default: return 'info';
    }
  }

  onEdit(incident: IncidentWithDetails) {
    console.log('Edit incident:', incident);
  }

  onDelete(incident: IncidentWithDetails) {
    console.log('Delete incident:', incident);
  }

  onCreate() {
    console.log('Create new incident');
  }

  onViewDetails(incident: IncidentWithDetails) {
    console.log('View incident details:', incident);
  }

  onFilterByStatus() {
    console.log('Filter by status:', this.selectedStatus);
  }
}

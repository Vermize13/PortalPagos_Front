import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { 
  Incident, 
  IncidentStatus, 
  IncidentPriority, 
  IncidentSeverity 
} from '../../../domain/models';

// Helper interface for displaying incidents with additional info
interface IncidentDisplay extends Incident {
  projectName?: string;
  sprintName?: string;
  reporterName?: string;
  assigneeName?: string;
}

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule, DropdownModule, FormsModule],
  templateUrl: './incidents-list.component.html',
  styleUrls: ['./incidents-list.component.css']
})
export class IncidentsListComponent implements OnInit {
  incidents: IncidentDisplay[] = [];
  loading: boolean = false;
  
  statuses = Object.values(IncidentStatus);
  priorities = Object.values(IncidentPriority);
  selectedStatus: string = '';

  ngOnInit() {
    this.loadIncidents();
  }

  loadIncidents() {
    this.loading = true;
    // Mock data for demonstration - using Guid format
    this.incidents = [
      {
        id: '750e8400-e29b-41d4-a716-446655440001',
        projectId: '650e8400-e29b-41d4-a716-446655440001',
        project: null,
        projectName: 'Portal de Pagos',
        sprintId: '850e8400-e29b-41d4-a716-446655440001',
        sprint: null,
        sprintName: 'Sprint 1',
        code: 'PP-1',
        title: 'Error en el formulario de login',
        description: 'El usuario no puede iniciar sesión',
        status: IncidentStatus.Open,
        priority: IncidentPriority.Must,
        severity: IncidentSeverity.High,
        reporterId: '550e8400-e29b-41d4-a716-446655440002',
        reporter: null,
        reporterName: 'John Developer',
        assigneeId: '550e8400-e29b-41d4-a716-446655440003',
        assignee: null,
        assigneeName: 'Jane Tester',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-01'),
        labels: [],
        comments: []
      },
      {
        id: '750e8400-e29b-41d4-a716-446655440002',
        projectId: '650e8400-e29b-41d4-a716-446655440001',
        project: null,
        projectName: 'Portal de Pagos',
        code: 'PP-2',
        title: 'Optimizar consulta de base de datos',
        description: 'Las consultas son muy lentas',
        status: IncidentStatus.InProgress,
        priority: IncidentPriority.Should,
        severity: IncidentSeverity.Medium,
        reporterId: '550e8400-e29b-41d4-a716-446655440001',
        reporter: null,
        reporterName: 'Admin User',
        assigneeId: '550e8400-e29b-41d4-a716-446655440002',
        assignee: null,
        assigneeName: 'John Developer',
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05'),
        labels: [],
        comments: []
      },
      {
        id: '750e8400-e29b-41d4-a716-446655440003',
        projectId: '650e8400-e29b-41d4-a716-446655440002',
        project: null,
        projectName: 'Sistema de Incidencias',
        sprintId: '850e8400-e29b-41d4-a716-446655440002',
        sprint: null,
        sprintName: 'Sprint 2',
        code: 'SI-1',
        title: 'Implementar filtros avanzados',
        description: 'Añadir filtros por múltiples criterios',
        status: IncidentStatus.Resolved,
        priority: IncidentPriority.Could,
        severity: IncidentSeverity.Low,
        reporterId: '550e8400-e29b-41d4-a716-446655440001',
        reporter: null,
        reporterName: 'Admin User',
        assigneeId: '550e8400-e29b-41d4-a716-446655440002',
        assignee: null,
        assigneeName: 'John Developer',
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-03-10'),
        closedAt: new Date('2024-03-10'),
        labels: [],
        comments: []
      }
    ];
    this.loading = false;
  }

  getStatusSeverity(status: IncidentStatus): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case IncidentStatus.Open: return 'info';
      case IncidentStatus.InProgress: return 'warning';
      case IncidentStatus.Resolved: return 'success';
      case IncidentStatus.Closed: return 'secondary';
      case IncidentStatus.Rejected: return 'danger';
      case IncidentStatus.Duplicated: return 'secondary';
      default: return 'info';
    }
  }

  getPrioritySeverity(priority: IncidentPriority): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (priority) {
      case IncidentPriority.Wont: return 'secondary';
      case IncidentPriority.Could: return 'success';
      case IncidentPriority.Should: return 'info';
      case IncidentPriority.Must: return 'danger';
      default: return 'info';
    }
  }

  onEdit(incident: IncidentDisplay) {
    console.log('Edit incident:', incident);
  }

  onDelete(incident: IncidentDisplay) {
    console.log('Delete incident:', incident);
  }

  onCreate() {
    console.log('Create new incident');
  }

  onViewDetails(incident: IncidentDisplay) {
    console.log('View incident details:', incident);
  }

  onFilterByStatus() {
    console.log('Filter by status:', this.selectedStatus);
  }
}

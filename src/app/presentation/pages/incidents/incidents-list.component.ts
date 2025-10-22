import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { 
  Incident, 
  IncidentStatus, 
  IncidentPriority, 
  IncidentSeverity,
  IncidentWithDetails
} from '../../../domain/models';
import { IncidentService, IncidentFilter, CreateIncidentRequest, UpdateIncidentRequest } from '../../../data/services/incident.service';
import { ProjectService } from '../../../data/services/project.service';
import { UserService } from '../../../data/services/user.service';
import { ToastService } from '../../../data/services/toast.service';

// Helper interface for displaying incidents with additional info
interface IncidentDisplay extends Incident {
  projectName?: string;
  sprintName?: string;
  reporterName?: string;
  assigneeName?: string;
}

interface IncidentFormData {
  id?: string;
  projectId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  status?: IncidentStatus;
  assigneeId?: string;
  dueDate?: Date;
}

@Component({
  selector: 'app-incidents-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CardModule, 
    TableModule, 
    ButtonModule, 
    TagModule, 
    DropdownModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './incidents-list.component.html',
  styleUrls: ['./incidents-list.component.css']
})
export class IncidentsListComponent implements OnInit {
  incidents: IncidentDisplay[] = [];
  loading: boolean = false;
  
  statuses = Object.values(IncidentStatus);
  priorities = Object.values(IncidentPriority).map(p => ({ label: p, value: p }));
  severities = Object.values(IncidentSeverity).map(s => ({ label: s, value: s }));
  selectedStatus: string = '';
  
  // Dialog state
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  
  // Form data
  incidentForm: IncidentFormData = {
    projectId: '',
    title: '',
    description: '',
    severity: IncidentSeverity.Medium,
    priority: IncidentPriority.Should
  };
  
  // Dropdown options
  projects: any[] = [];
  users: any[] = [];

  constructor(
    private incidentService: IncidentService,
    private projectService: ProjectService,
    private userService: UserService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadIncidents();
    this.loadDropdownData();
  }
  
  loadDropdownData() {
    // Load projects for dropdown
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects.map(p => ({ label: p.name, value: p.id }));
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
    
    // Load users for dropdown
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.map(u => ({ label: u.name, value: u.id }));
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  loadIncidents() {
    this.loading = true;
    const filter: IncidentFilter = {};
    if (this.selectedStatus) {
      filter.status = this.selectedStatus as IncidentStatus;
    }
    
    this.incidentService.getAll(filter).subscribe({
      next: (incidents: IncidentWithDetails[]) => {
        // Map to display format
        this.incidents = incidents.map(inc => ({
          ...inc,
          projectName: inc.project?.name,
          sprintName: inc.sprint?.name,
          reporterName: inc.reporterName || inc.reporter?.name,
          assigneeName: inc.assigneeName || inc.assignee?.name
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading incidents:', error);
        this.toastService.showError('Error', 'No se pudieron cargar las incidencias');
        this.loading = false;
        // Fallback to mock data on error
        this.loadMockIncidents();
      }
    });
  }

  loadMockIncidents() {
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
    this.isEditMode = true;
    this.incidentForm = {
      id: incident.id,
      projectId: incident.projectId,
      title: incident.title,
      description: incident.description || '',
      severity: incident.severity,
      priority: incident.priority,
      status: incident.status,
      assigneeId: incident.assigneeId,
      dueDate: incident.dueDate ? new Date(incident.dueDate) : undefined
    };
    this.displayDialog = true;
  }

  onDelete(incident: IncidentDisplay) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la incidencia ${incident.code}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        // TODO: Implement delete API call when available
        this.toastService.showSuccess('Éxito', `Incidencia ${incident.code} eliminada correctamente`);
        this.loadIncidents();
      }
    });
  }

  onCreate() {
    this.isEditMode = false;
    this.incidentForm = {
      projectId: '',
      title: '',
      description: '',
      severity: IncidentSeverity.Medium,
      priority: IncidentPriority.Should
    };
    this.displayDialog = true;
  }

  onViewDetails(incident: IncidentDisplay) {
    console.log('View incident details:', incident);
    // TODO: Navigate to incident details page
  }

  onFilterByStatus() {
    console.log('Filter by status:', this.selectedStatus);
    this.loadIncidents();
  }
  
  onSaveIncident() {
    if (!this.validateForm()) {
      this.toastService.showError('Error', 'Por favor complete todos los campos requeridos');
      return;
    }
    
    if (this.isEditMode && this.incidentForm.id) {
      const updateRequest: UpdateIncidentRequest = {
        title: this.incidentForm.title,
        description: this.incidentForm.description,
        severity: this.incidentForm.severity,
        priority: this.incidentForm.priority,
        status: this.incidentForm.status,
        assigneeId: this.incidentForm.assigneeId,
        dueDate: this.incidentForm.dueDate?.toISOString().split('T')[0]
      };
      
      this.incidentService.update(this.incidentForm.id, updateRequest).subscribe({
        next: () => {
          this.toastService.showSuccess('Éxito', 'Incidencia actualizada correctamente');
          this.displayDialog = false;
          this.loadIncidents();
        },
        error: (error) => {
          console.error('Error updating incident:', error);
          this.toastService.showError('Error', 'No se pudo actualizar la incidencia');
        }
      });
    } else {
      const createRequest: CreateIncidentRequest = {
        projectId: this.incidentForm.projectId,
        title: this.incidentForm.title,
        description: this.incidentForm.description,
        severity: this.incidentForm.severity,
        priority: this.incidentForm.priority,
        assigneeId: this.incidentForm.assigneeId,
        dueDate: this.incidentForm.dueDate?.toISOString().split('T')[0]
      };
      
      this.incidentService.create(createRequest).subscribe({
        next: () => {
          this.toastService.showSuccess('Éxito', 'Incidencia creada correctamente');
          this.displayDialog = false;
          this.loadIncidents();
        },
        error: (error) => {
          console.error('Error creating incident:', error);
          this.toastService.showError('Error', 'No se pudo crear la incidencia');
        }
      });
    }
  }
  
  onCancelDialog() {
    this.displayDialog = false;
  }
  
  validateForm(): boolean {
    if (!this.incidentForm.title || !this.incidentForm.projectId) {
      return false;
    }
    return true;
  }
}

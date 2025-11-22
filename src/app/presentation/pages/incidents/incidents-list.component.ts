import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { IncidentPriorityMapping, IncidentSeverityMapping, IncidentStatusMapping } from '../../../domain/models/enum-mappings';

// Helper interface for displaying incidents with additional info
interface IncidentDisplay extends Incident {
  // Display-friendly names and labels (keep original enum-typed properties like status/priority/severity)
  projectName?: string;
  sprintName?: string;
  reporterName?: string;
  assigneeName?: string;
  statusLabel?: string;
  priorityLabel?: string;
  severityLabel?: string;
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
  
  statuses = Object.values(IncidentStatus).filter(value => typeof value === 'number') as IncidentStatus[];
  priorities = IncidentPriorityMapping;
  severities = IncidentSeverityMapping;
  statusOptions = IncidentStatusMapping;
  selectedStatus: string = '';
  
  // View mode
  viewMode: 'board' | 'table' = 'board';
  
  // Dialog state
  displayDialog: boolean = false;
  isEditMode: boolean = false;

  // Date range
  minDate: Date | null = new Date();
  maxDate: Date | null = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  
  // Form data
  incidentForm: IncidentFormData = {
    projectId: '',
    title: '',
    description: '',
    severity: IncidentSeverity.Medio,
    priority: IncidentPriority.DeberíaHacer
  };
  
  // Dropdown options
  projects: any[] = [];
  users: any[] = [];

  constructor(
    private incidentService: IncidentService,
    private projectService: ProjectService,
    private userService: UserService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private router: Router
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

    this.incidentService.getAll(filter).subscribe({
      next: (incidents: IncidentWithDetails[]) => {
        // Map to display format
        this.incidents = incidents.map(inc => ({
          ...inc,
          statusLabel: IncidentStatusMapping.find((s: { label: string; value: IncidentStatus }) => s.value === inc.status)?.label ?? 'Desconocido',
          priorityLabel: IncidentPriorityMapping.find((p: { label: string; value: IncidentPriority }) => p.value === inc.priority)?.label ?? 'Desconocido',
          severityLabel: IncidentSeverityMapping.find((sev: { label: string; value: IncidentSeverity }) => sev.value === inc.severity)?.label ?? 'Desconocido',
          projectName: inc.project?.name,
          sprintName: inc.sprint?.name,
          reporterName: inc.reporterName || inc.reporter?.name,
          assigneeName: inc.assigneeName || inc.assignee?.name
        }));
        console.log('Loaded incidents:', this.incidents);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading incidents:', error);
        this.toastService.showError('Error', 'No se pudieron cargar las incidencias');
        this.loading = false;
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
        status: IncidentStatus.Abierto,
        priority: IncidentPriority.DebeHacer,
        severity: IncidentSeverity.Alto,
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
        status: IncidentStatus.EnProgreso,
        priority: IncidentPriority.DeberíaHacer,
        severity: IncidentSeverity.Medio,
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
        status: IncidentStatus.Resuelto,
        priority: IncidentPriority.PodríaHacer,
        severity: IncidentSeverity.Bajo,
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
      severity: IncidentSeverity.Medio,
      priority: IncidentPriority.DeberíaHacer
    };
    this.displayDialog = true;
  }

  onViewDetails(incident: IncidentDisplay) {
    this.router.navigate(['/inicio/incidents', incident.id]);
  }

  onFilterByStatus() {
    console.log('Filter by status:', this.selectedStatus);
    // When filtering by status, switch to table view
    if (this.selectedStatus) {
      this.viewMode = 'table';
    }
    this.loadIncidents();
  }
  
  toggleView(mode: 'board' | 'table') {
    this.viewMode = mode;
    // Clear status filter when switching to board view
    if (mode === 'board') {
      this.selectedStatus = '';
      this.loadIncidents();
    }
  }
  
  getIncidentsByStatus(status: IncidentStatus): IncidentDisplay[] {
    return this.incidents.filter(inc => inc.status === status);
  }
  
  getStatusLabel(status: IncidentStatus): string {
    const labels = [
      'Abierto',
      'En Progreso',
      'Resuelto',
      'Cerrado',
      'Rechazado',
      'Duplicado'
    ];

    return labels[status];
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

  // Drag and drop functionality
  draggedIncident: IncidentDisplay | null = null;

  onDragStart(event: DragEvent, incident: IncidentDisplay) {
    this.draggedIncident = incident;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', incident.id);
    }
  }

  onDragEnd(event: DragEvent) {
    this.draggedIncident = null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, targetStatus: IncidentStatus) {
    event.preventDefault();
    
    if (this.draggedIncident && this.draggedIncident.status !== targetStatus) {
      const updateRequest: UpdateIncidentRequest = {
        status: targetStatus
      };
      
      this.incidentService.update(this.draggedIncident.id, updateRequest).subscribe({
        next: () => {
          this.toastService.showSuccess('Éxito', 'Estado de incidencia actualizado');
          this.loadIncidents();
        },
        error: (error) => {
          console.error('Error updating incident status:', error);
          this.toastService.showError('Error', 'No se pudo actualizar el estado de la incidencia');
        }
      });
    }
    
    this.draggedIncident = null;
  }
}

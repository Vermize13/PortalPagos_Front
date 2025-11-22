import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProjectWithMembers, ProjectMemberDetail, Label } from '../../../domain/models';
import { ProjectService, UpdateProjectRequest } from '../../../data/services/project.service';
import { LabelService, CreateLabelRequest } from '../../../data/services/label.service';
import { ToastService } from '../../../data/services/toast.service';
import { SprintListComponent } from '../../components/sprints/sprint-list.component';

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    TabViewModule,
    TableModule,
    AvatarModule,
    AvatarGroupModule,
    ProgressSpinnerModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ColorPickerModule,
    CheckboxModule,
    ConfirmDialogModule,
    SprintListComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  project: ProjectWithMembers | null = null;
  projectId: string = '';
  loading: boolean = false;
  members: ProjectMemberDetail[] = [];
  
  // Labels
  labels: Label[] = [];
  loadingLabels: boolean = false;
  displayLabelDialog: boolean = false;
  isEditingLabel: boolean = false;
  labelForm = {
    id: '',
    name: '',
    colorHex: '#3b82f6'
  };
  submittedLabel: boolean = false;
  
  // Edit project
  displayEditDialog: boolean = false;
  editProjectForm = {
    name: '',
    description: '',
    isActive: true
  };
  submittedProject: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private labelService: LabelService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.loadProject();
        this.loadLabels();
      }
    });
  }

  loadProject() {
    this.loading = true;
    this.projectService.getById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.members = project.memberDetails?.map(m => ({
          ...m,
          userName: m.userName || m.user?.name || 'Unknown',
          userEmail: m.userEmail || m.user?.email || '',
          roleName: m.roleName || m.role?.name || 'Member'
        })) || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.toastService.showError('Error', 'No se pudo cargar el proyecto');
        this.loading = false;
        // Fallback to mock data for demonstration
        this.loadMockProject();
      }
    });
  }

  loadMockProject() {
    this.project = {
      id: this.projectId,
      name: 'Portal de Pagos',
      code: 'PP',
      description: 'Sistema integral de gestión de pagos para la organización. Permite administrar facturas, realizar pagos, generar reportes y mantener un histórico completo de transacciones.',
      isActive: true,
      createdBy: '550e8400-e29b-41d4-a716-446655440001',
      creator: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Juan Pérez',
        email: 'juan.perez@example.com'
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-11-20'),
      members: []
    };

    this.members = [
      {
        projectId: this.projectId,
        project: null,
        userId: '550e8400-e29b-41d4-a716-446655440001',
        user: null,
        roleId: '1',
        role: null,
        joinedAt: new Date('2024-01-01'),
        isActive: true,
        userName: 'Juan Pérez',
        userEmail: 'juan.perez@example.com',
        roleName: 'Project Manager'
      },
      {
        projectId: this.projectId,
        project: null,
        userId: '550e8400-e29b-41d4-a716-446655440002',
        user: null,
        roleId: '2',
        role: null,
        joinedAt: new Date('2024-01-15'),
        isActive: true,
        userName: 'María García',
        userEmail: 'maria.garcia@example.com',
        roleName: 'Developer'
      },
      {
        projectId: this.projectId,
        project: null,
        userId: '550e8400-e29b-41d4-a716-446655440003',
        user: null,
        roleId: '2',
        role: null,
        joinedAt: new Date('2024-02-01'),
        isActive: true,
        userName: 'Carlos López',
        userEmail: 'carlos.lopez@example.com',
        roleName: 'Developer'
      },
      {
        projectId: this.projectId,
        project: null,
        userId: '550e8400-e29b-41d4-a716-446655440004',
        user: null,
        roleId: '3',
        role: null,
        joinedAt: new Date('2024-02-15'),
        isActive: true,
        userName: 'Ana Martínez',
        userEmail: 'ana.martinez@example.com',
        roleName: 'Designer'
      }
    ];
  }

  getStatusSeverity(isActive: boolean): 'success' | 'secondary' {
    return isActive ? 'success' : 'secondary';
  }

  onBack() {
    this.router.navigate(['/inicio/projects']);
  }

  onEdit() {
    if (this.project) {
      this.editProjectForm = {
        name: this.project.name,
        description: this.project.description || '',
        isActive: this.project.isActive
      };
      this.submittedProject = false;
      this.displayEditDialog = true;
    }
  }
  
  onSaveProject() {
    this.submittedProject = true;
    
    if (!this.editProjectForm.name) {
      return;
    }
    
    const updateRequest: UpdateProjectRequest = {
      name: this.editProjectForm.name,
      description: this.editProjectForm.description,
      isActive: this.editProjectForm.isActive
    };
    
    this.projectService.update(this.projectId, updateRequest).subscribe({
      next: () => {
        this.toastService.showSuccess('Éxito', 'Proyecto actualizado correctamente');
        this.displayEditDialog = false;
        this.loadProject();
      },
      error: (error) => {
        console.error('Error updating project:', error);
        this.toastService.showError('Error', 'No se pudo actualizar el proyecto');
      }
    });
  }
  
  onCancelEdit() {
    this.displayEditDialog = false;
    this.submittedProject = false;
  }
  
  // Label management methods
  loadLabels() {
    this.loadingLabels = true;
    this.labelService.getByProject(this.projectId).subscribe({
      next: (labels) => {
        this.labels = labels;
        this.loadingLabels = false;
      },
      error: (error) => {
        console.error('Error loading labels:', error);
        this.toastService.showError('Error', 'No se pudieron cargar las etiquetas');
        this.loadingLabels = false;
      }
    });
  }
  
  onCreateLabel() {
    this.isEditingLabel = false;
    this.labelForm = {
      id: '',
      name: '',
      colorHex: '#3b82f6'
    };
    this.submittedLabel = false;
    this.displayLabelDialog = true;
  }
  
  onEditLabel(label: Label) {
    this.isEditingLabel = true;
    this.labelForm = {
      id: label.id,
      name: label.name,
      colorHex: label.colorHex || '#3b82f6'
    };
    this.submittedLabel = false;
    this.displayLabelDialog = true;
  }
  
  onSaveLabel() {
    this.submittedLabel = true;
    
    if (!this.labelForm.name.trim()) {
      return;
    }
    
    if (this.isEditingLabel) {
      this.toastService.showInfo('Información', 'La edición de etiquetas estará disponible próximamente');
      this.displayLabelDialog = false;
    } else {
      const request: CreateLabelRequest = {
        projectId: this.projectId,
        name: this.labelForm.name.trim(),
        colorHex: this.labelForm.colorHex
      };
      
      this.labelService.create(request).subscribe({
        next: () => {
          this.toastService.showSuccess('Éxito', 'Etiqueta creada correctamente');
          this.displayLabelDialog = false;
          this.loadLabels();
        },
        error: (error) => {
          console.error('Error creating label:', error);
          this.toastService.showError('Error', 'No se pudo crear la etiqueta');
        }
      });
    }
  }
  
  onDeleteLabel(label: Label) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la etiqueta "${label.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.toastService.showInfo('Información', 'La eliminación de etiquetas estará disponible próximamente');
      }
    });
  }
  
  onCancelLabel() {
    this.displayLabelDialog = false;
    this.submittedLabel = false;
  }

  getMemberInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getDaysActive(): number {
    if (!this.project) return 0;
    const now = new Date();
    const created = new Date(this.project.createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getActiveMembersCount(): number {
    return this.members.filter(m => m.isActive).length;
  }
}

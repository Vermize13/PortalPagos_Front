import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Project } from '../../../domain/models';
import { ProjectService, CreateProjectRequest, UpdateProjectRequest } from '../../../data/services/project.service';
import { ToastService } from '../../../data/services/toast.service';

interface ProjectFormData {
  id?: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
}

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CardModule, 
    TableModule, 
    ButtonModule, 
    TagModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [];
  loading: boolean = false;
  
  // Dialog state
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  
  // Form data
  projectForm: ProjectFormData = {
    name: '',
    code: '',
    description: '',
    isActive: true
  };

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.toastService.showError('Error', 'No se pudieron cargar los proyectos');
        this.loading = false;
        // Fallback to mock data on error
        this.loadMockProjects();
      }
    });
  }

  loadMockProjects() {
    // Mock data for demonstration - using Guid format
    this.projects = [
      {
        id: '650e8400-e29b-41d4-a716-446655440001',
        name: 'Portal de Pagos',
        code: 'PP',
        description: 'Sistema de gestión de pagos',
        isActive: true,
        createdBy: '550e8400-e29b-41d4-a716-446655440001',
        creator: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        members: []
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440002',
        name: 'Sistema de Incidencias',
        code: 'SI',
        description: 'Bug tracking y gestión de incidencias',
        isActive: true,
        createdBy: '550e8400-e29b-41d4-a716-446655440001',
        creator: null,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
        members: []
      },
      {
        id: '650e8400-e29b-41d4-a716-446655440003',
        name: 'Portal Web',
        code: 'PW',
        description: 'Sitio web corporativo',
        isActive: false,
        createdBy: '550e8400-e29b-41d4-a716-446655440002',
        creator: null,
        createdAt: new Date('2023-06-01'),
        updatedAt: new Date('2023-12-31'),
        members: []
      }
    ];
  }

  getStatusSeverity(isActive: boolean): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    return isActive ? 'success' : 'secondary';
  }

  onEdit(project: Project) {
    this.isEditMode = true;
    this.projectForm = {
      id: project.id,
      name: project.name,
      code: project.code,
      description: project.description || '',
      isActive: project.isActive
    };
    this.displayDialog = true;
  }

  onDelete(project: Project) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el proyecto ${project.name}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.projectService.delete(project.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Éxito', `Proyecto ${project.name} eliminado correctamente`);
            this.loadProjects();
          },
          error: (error) => {
            console.error('Error deleting project:', error);
            this.toastService.showError('Error', 'No se pudo eliminar el proyecto');
          }
        });
      }
    });
  }

  onCreate() {
    this.isEditMode = false;
    this.projectForm = {
      name: '',
      code: '',
      description: '',
      isActive: true
    };
    this.displayDialog = true;
  }

  onViewDetails(project: Project) {
    console.log('View project details:', project);
    // TODO: Navigate to project details page or show details dialog
  }
  
  onSaveProject() {
    if (!this.validateForm()) {
      this.toastService.showError('Error', 'Por favor complete todos los campos requeridos');
      return;
    }
    
    if (this.isEditMode && this.projectForm.id) {
      const updateRequest: UpdateProjectRequest = {
        name: this.projectForm.name,
        description: this.projectForm.description,
        isActive: this.projectForm.isActive
      };
      
      this.projectService.update(this.projectForm.id, updateRequest).subscribe({
        next: () => {
          this.toastService.showSuccess('Éxito', 'Proyecto actualizado correctamente');
          this.displayDialog = false;
          this.loadProjects();
        },
        error: (error) => {
          console.error('Error updating project:', error);
          this.toastService.showError('Error', 'No se pudo actualizar el proyecto');
        }
      });
    } else {
      const createRequest: CreateProjectRequest = {
        name: this.projectForm.name,
        code: this.projectForm.code,
        description: this.projectForm.description
      };
      
      this.projectService.create(createRequest).subscribe({
        next: () => {
          this.toastService.showSuccess('Éxito', 'Proyecto creado correctamente');
          this.displayDialog = false;
          this.loadProjects();
        },
        error: (error) => {
          console.error('Error creating project:', error);
          this.toastService.showError('Error', 'No se pudo crear el proyecto');
        }
      });
    }
  }
  
  onCancelDialog() {
    this.displayDialog = false;
  }
  
  validateForm(): boolean {
    if (!this.projectForm.name || !this.projectForm.code) {
      return false;
    }
    return true;
  }
}

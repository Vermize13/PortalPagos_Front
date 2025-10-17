import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Project } from '../../../domain/models';
import { ProjectService } from '../../../data/services/project.service';
import { ToastService } from '../../../data/services/toast.service';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule],
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css']
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [];
  loading: boolean = false;

  constructor(
    private projectService: ProjectService,
    private toastService: ToastService
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
    console.log('Edit project:', project);
  }

  onDelete(project: Project) {
    console.log('Delete project:', project);
  }

  onCreate() {
    console.log('Create new project');
  }

  onViewDetails(project: Project) {
    console.log('View project details:', project);
  }
}

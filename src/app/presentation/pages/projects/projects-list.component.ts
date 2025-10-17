import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Project, ProjectStatus } from '../../../domain/models';

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

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    // Mock data for demonstration
    this.projects = [
      {
        id: 1,
        name: 'Portal de Pagos',
        description: 'Sistema de gestión de pagos',
        status: ProjectStatus.Active,
        startDate: new Date('2024-01-01'),
        createdAt: new Date('2024-01-01'),
        ownerId: 1
      },
      {
        id: 2,
        name: 'Sistema de Incidencias',
        description: 'Bug tracking y gestión de incidencias',
        status: ProjectStatus.Active,
        startDate: new Date('2024-02-01'),
        createdAt: new Date('2024-02-01'),
        ownerId: 1
      },
      {
        id: 3,
        name: 'Portal Web',
        description: 'Sitio web corporativo',
        status: ProjectStatus.Completed,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-12-31'),
        createdAt: new Date('2023-06-01'),
        ownerId: 2
      }
    ];
    this.loading = false;
  }

  getStatusSeverity(status: ProjectStatus): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case ProjectStatus.Active: return 'success';
      case ProjectStatus.OnHold: return 'warning';
      case ProjectStatus.Completed: return 'info';
      case ProjectStatus.Archived: return 'secondary';
      default: return 'info';
    }
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

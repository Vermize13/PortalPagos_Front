import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Project, ProjectMemberDetail } from '../../../domain/models';
import { ProjectService } from '../../../data/services/project.service';
import { ToastService } from '../../../data/services/toast.service';

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    TabViewModule,
    TableModule,
    AvatarModule,
    AvatarGroupModule,
    ProgressSpinnerModule,
    TooltipModule
  ],
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  project: Project | null = null;
  projectId: string = '';
  loading: boolean = false;
  members: ProjectMemberDetail[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.loadProject();
      }
    });
  }

  loadProject() {
    this.loading = true;
    this.projectService.getById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.members = project.members?.map(m => ({
          ...m,
          userName: m.user?.name || 'Unknown',
          userEmail: m.user?.email || '',
          roleName: m.role?.name || 'Member'
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
    this.toastService.showInfo('Información', 'Función de edición en desarrollo');
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

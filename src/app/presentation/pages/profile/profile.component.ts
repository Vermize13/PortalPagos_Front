import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TabViewModule } from 'primeng/tabview';
import { UserStateService } from '../../../data/states/userState.service';
import { UserService } from '../../../data/services/user.service';
import { IncidentService } from '../../../data/services/incident.service';
import { ProjectService } from '../../../data/services/project.service';
import { ToastService } from '../../../data/services/toast.service';
import { User as DomainUser } from '../../../domain/models/user.model';
import { IncidentWithDetails } from '../../../domain/models';
import { ProjectMemberDetail } from '../../../domain/models';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    TagModule,
    TabViewModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private userStateService = inject(UserStateService);
  private userService = inject(UserService);
  private incidentService = inject(IncidentService);
  private projectService = inject(ProjectService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  user: DomainUser | null = null;
  loading = false;
  loadingIncidents = false;
  loadingProjects = false;
  
  assignedIncidents: IncidentWithDetails[] = [];
  reportedIncidents: IncidentWithDetails[] = [];
  userProjects: { project: any, role: string }[] = [];
  
  isViewingOtherUser = false;
  isAdmin = false;
  
  get currentUser() {
    return this.userStateService.getUser();
  }

  ngOnInit(): void {
    const currentUser = this.userStateService.getUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Check if current user is admin
    this.isAdmin = !!(currentUser.role && currentUser.role.toLowerCase() === 'admin');
    
    // Get userId from route parameter or use current user
    this.route.paramMap.subscribe(params => {
      const userId = params.get('userId');
      if (userId) {
        // Viewing another user's profile - only admins allowed
        if (!this.isAdmin) {
          this.toastService.showError('Acceso Denegado', 'Solo los administradores pueden ver perfiles de otros usuarios');
          this.router.navigate(['/inicio/profile']);
          return;
        }
        this.isViewingOtherUser = true;
        this.loadUserProfile(userId);
      } else {
        // Viewing own profile
        this.isViewingOtherUser = false;
        this.loadUserProfile(currentUser.nameid.toString());
      }
    });
  }

  loadUserProfile(userId: string): void {
    this.loading = true;
    
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
        // Load incidents and projects for this user
        this.loadUserIncidents(user.id);
        this.loadUserProjects(user.id);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.toastService.showError('Error', 'No se pudo cargar el perfil del usuario');
        this.loading = false;
        this.router.navigate(['/inicio/dashboard']);
      }
    });
  }

  loadUserIncidents(userId: string): void {
    this.loadingIncidents = true;
    
    // Load both assigned and reported incidents in parallel
    forkJoin({
      assigned: this.incidentService.getAll({ assigneeId: userId }),
      reported: this.incidentService.getAll({ reporterId: userId })
    }).subscribe({
      next: (results) => {
        this.assignedIncidents = results.assigned;
        this.reportedIncidents = results.reported;
        this.loadingIncidents = false;
      },
      error: (error) => {
        console.error('Error loading incidents:', error);
        this.toastService.showError('Error', 'No se pudieron cargar las incidencias');
        this.loadingIncidents = false;
      }
    });
  }

  loadUserProjects(userId: string): void {
    this.loadingProjects = true;
    
    // Get all projects and filter by user membership
    this.projectService.getAll().subscribe({
      next: async (projects) => {
        // For each project, check if user is a member
        const projectPromises = projects.map(async project => {
          try {
            const members = await firstValueFrom(this.projectService.getMembers(project.id));
            const userMember = members?.find(m => m.userId === userId);
            if (userMember) {
              return { 
                project: project, 
                role: userMember.roleName || 'Sin rol'
              };
            }
            return null;
          } catch (error) {
            console.error(`Error loading members for project ${project.id}:`, error);
            return null;
          }
        });

        try {
          const results = await Promise.all(projectPromises);
          this.userProjects = results.filter(r => r !== null) as { project: any, role: string }[];
        } finally {
          this.loadingProjects = false;
        }
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.toastService.showError('Error', 'No se pudieron cargar los proyectos');
        this.loadingProjects = false;
      }
    });
  }

  getStatusSeverity(status: number): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    // Status: 0=Open, 1=InProgress, 2=Resolved, 3=Closed, 4=Reopened, 5=OnHold
    switch (status) {
      case 0: return 'info';      // Open
      case 1: return 'warning';   // InProgress
      case 2: return 'success';   // Resolved
      case 3: return 'secondary'; // Closed
      case 4: return 'danger';    // Reopened
      case 5: return 'contrast';  // OnHold
      default: return 'info';
    }
  }

  getStatusLabel(status: number): string {
    const labels = ['Abierto', 'En Progreso', 'Resuelto', 'Cerrado', 'Reabierto', 'En Espera'];
    return labels[status] || 'Desconocido';
  }

  getPrioritySeverity(priority: number): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    // Priority: 0=Low, 1=Medium, 2=High, 3=Critical
    switch (priority) {
      case 0: return 'success';  // Low
      case 1: return 'info';     // Medium
      case 2: return 'warning';  // High
      case 3: return 'danger';   // Critical
      default: return 'info';
    }
  }

  getPriorityLabel(priority: number): string {
    const labels = ['Baja', 'Media', 'Alta', 'Crítica'];
    return labels[priority] || 'Desconocida';
  }

  viewIncident(incidentId: string): void {
    this.router.navigate(['/inicio/incidents', incidentId]);
  }

  viewProject(projectId: string): void {
    this.router.navigate(['/inicio/projects', projectId]);
  }

  goBack(): void {
    if (this.isViewingOtherUser) {
      this.router.navigate(['/inicio/users']);
    } else {
      this.router.navigate(['/inicio/dashboard']);
    }
  }
}

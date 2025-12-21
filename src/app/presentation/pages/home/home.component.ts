import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { UserStateService } from '../../../data/states/userState.service';
import { UserService } from '../../../data/services/user.service';
import { ProjectService } from '../../../data/services/project.service';
import { ToastService } from '../../../data/services/toast.service';
import { User as DomainUser } from '../../../domain/models/user.model';
import { Project } from '../../../domain/models';
import { firstValueFrom } from 'rxjs';

interface UserProjectInfo {
  project: Project;
  role: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    SkeletonModule,
    TooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private userStateService = inject(UserStateService);
  private userService = inject(UserService);
  private projectService = inject(ProjectService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  user: DomainUser | null = null;
  loading = false;
  loadingProjects = false;
  userProjects: UserProjectInfo[] = [];

  get currentUser() {
    return this.userStateService.getUser();
  }

  ngOnInit() {
    const currentUser = this.userStateService.getUser();
    if (!currentUser || !currentUser.nameid) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserProfile(currentUser.nameid);
  }

  loadUserProfile(userId: string): void {
    this.loading = true;

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
        this.loadUserProjects(user.id);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.toastService.showError('Error', 'No se pudo cargar el perfil del usuario');
        this.loading = false;
      }
    });
  }

  loadUserProjects(userId: string): void {
    this.loadingProjects = true;

    // Get all projects and filter by user membership
    // TODO: This makes N+1 API calls. Consider adding a backend endpoint like
    // GET /api/Users/{userId}/projects to fetch user's projects in a single call
    this.projectService.getAll().subscribe({
      next: async (projects) => {
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
          this.userProjects = results.filter((r): r is UserProjectInfo => r !== null);
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

  viewProject(projectId: string): void {
    this.router.navigate(['/inicio/projects', projectId]);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/inicio/dashboard']);
  }

  navigateToProjects(): void {
    this.router.navigate(['/inicio/projects']);
  }
}

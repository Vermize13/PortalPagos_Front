import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Sprint, Permissions } from '../../../domain/models';
import { SprintService } from '../../../data/services/sprint.service';
import { ToastService } from '../../../data/services/toast.service';
import { PermissionService } from '../../../data/services/permission.service';
import { SprintDialogComponent } from './sprint-dialog.component';

@Component({
  selector: 'app-sprint-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    SprintDialogComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.css']
})
export class SprintListComponent implements OnInit {
  @Input() projectId: string = '';

  sprints: Sprint[] = [];
  loading: boolean = false;
  showDialog: boolean = false;
  selectedSprint: Sprint | null = null;

  constructor(
    private sprintService: SprintService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    public permissionService: PermissionService
  ) {}

  ngOnInit() {
    if (this.projectId) {
      this.loadSprints();
    }
  }

  // Permission helper methods for template use
  canCreateSprint(): boolean {
    return this.permissionService.hasPermission(Permissions.SPRINT_CREATE);
  }

  canCloseSprint(): boolean {
    return this.permissionService.hasPermission(Permissions.SPRINT_CLOSE) ||
           this.permissionService.hasPermission(Permissions.SPRINT_UPDATE);
  }

  canDeleteSprint(): boolean {
    return this.permissionService.hasPermission(Permissions.SPRINT_DELETE);
  }

  loadSprints() {
    this.loading = true;
    this.sprintService.getByProject(this.projectId).subscribe({
      next: (sprints) => {
        if (Array.isArray(sprints)) {
          this.sprints = sprints.sort((a, b) => {
            // Sort by creation date, newest first
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        } else {
          console.error('Expected sprints to be an array, but got:', sprints);
          this.sprints = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sprints:', error);
        this.toastService.showError('Error', 'No se pudieron cargar los sprints');
        this.loading = false;
      }
    });
  }

  showCreateDialog() {
    this.selectedSprint = null;
    this.showDialog = true;
  }

  onSprintSaved(sprint: Sprint) {
    this.loadSprints();
  }

  closeSprint(sprint: Sprint) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas cerrar el sprint "${sprint.name}"?`,
      header: 'Cerrar Sprint',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cerrar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.sprintService.close(sprint.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Éxito', 'Sprint cerrado correctamente');
            this.loadSprints();
          },
          error: (error) => {
            console.error('Error closing sprint:', error);
            this.toastService.showError('Error', 'No se pudo cerrar el sprint');
          }
        });
      }
    });
  }

  deleteSprint(sprint: Sprint) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el sprint "${sprint.name}"? Esta acción no se puede deshacer.`,
      header: 'Eliminar Sprint',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.sprintService.delete(sprint.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Éxito', 'Sprint eliminado correctamente');
            this.loadSprints();
          },
          error: (error) => {
            console.error('Error deleting sprint:', error);
            this.toastService.showError('Error', 'No se pudo eliminar el sprint');
          }
        });
      }
    });
  }

  getSprintStatus(sprint: Sprint): string {
    const now = new Date();
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);

    if (now < start) {
      return 'Pendiente';
    } else if (now > end) {
      return 'Finalizado';
    } else {
      return 'Activo';
    }
  }

  getSprintSeverity(sprint: Sprint): 'success' | 'warning' | 'info' | 'secondary' {
    if (sprint.isClosed) {
      return 'secondary';
    }

    const status = this.getSprintStatus(sprint);
    switch (status) {
      case 'Activo':
        return 'success';
      case 'Pendiente':
        return 'info';
      case 'Finalizado':
        return 'warning';
      default:
        return 'secondary';
    }
  }
}

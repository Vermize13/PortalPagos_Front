import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Sprint } from '../../../domain/models';
import { SprintService } from '../../../data/services/sprint.service';
import { ToastService } from '../../../data/services/toast.service';
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
  template: `
    <p-card>
      <ng-template pTemplate="header">
        <div class="flex align-items-center justify-content-between p-3">
          <h3 class="m-0">Sprints del Proyecto</h3>
          <p-button 
            label="Nuevo Sprint" 
            icon="pi pi-plus"
            (onClick)="showCreateDialog()">
          </p-button>
        </div>
      </ng-template>

      <p-table 
        [value]="sprints"
        [loading]="loading"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} sprints"
        styleClass="p-datatable-sm">
        
        <ng-template pTemplate="header">
          <tr>
            <th>Nombre</th>
            <th>Objetivo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th style="width: 150px">Acciones</th>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="body" let-sprint>
          <tr>
            <td>
              <span class="font-semibold">{{ sprint.name }}</span>
            </td>
            <td>
              <span class="text-overflow-ellipsis">{{ sprint.goal || 'Sin objetivo' }}</span>
            </td>
            <td>{{ sprint.startDate | date:'shortDate' }}</td>
            <td>{{ sprint.endDate | date:'shortDate' }}</td>
            <td>
              <p-tag 
                [value]="sprint.isClosed ? 'Cerrado' : getSprintStatus(sprint)"
                [severity]="getSprintSeverity(sprint)">
              </p-tag>
            </td>
            <td>
              <div class="flex gap-2">
                <p-button 
                  *ngIf="!sprint.isClosed"
                  icon="pi pi-check" 
                  [rounded]="true"
                  [text]="true"
                  severity="success"
                  pTooltip="Cerrar Sprint"
                  (onClick)="closeSprint(sprint)">
                </p-button>
                <p-button 
                  icon="pi pi-trash" 
                  [rounded]="true"
                  [text]="true"
                  severity="danger"
                  pTooltip="Eliminar Sprint"
                  (onClick)="deleteSprint(sprint)">
                </p-button>
              </div>
            </td>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="text-center">
              <div class="py-4">
                <i class="pi pi-inbox text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-600">No hay sprints creados para este proyecto.</p>
                <p class="text-gray-500 text-sm">Crea tu primer sprint para comenzar a organizar el trabajo.</p>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>

    <app-sprint-dialog
      [(visible)]="showDialog"
      [projectId]="projectId"
      [sprint]="selectedSprint"
      (sprintSaved)="onSprintSaved($event)">
    </app-sprint-dialog>

    <p-confirmDialog></p-confirmDialog>
  `,
  styles: [`
    .text-overflow-ellipsis {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }
  `]
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
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    if (this.projectId) {
      this.loadSprints();
    }
  }

  loadSprints() {
    this.loading = true;
    this.sprintService.getByProject(this.projectId).subscribe({
      next: (sprints) => {
        this.sprints = sprints.sort((a, b) => {
          // Sort by creation date, newest first
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
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

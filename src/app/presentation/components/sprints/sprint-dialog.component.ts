import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { Sprint } from '../../../domain/models';
import { SprintService, CreateSprintRequest } from '../../../data/services/sprint.service';
import { ToastService } from '../../../data/services/toast.service';

@Component({
  selector: 'app-sprint-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule
  ],
  template: `
    <p-dialog 
      [(visible)]="visible"
      [modal]="true"
      [style]="{width: '500px'}"
      [header]="'Crear Nuevo Sprint'"
      [closable]="true"
      (onHide)="onCancel()">
      
      <div class="p-fluid">
        <div class="field mb-3">
          <label for="name" class="font-bold">Nombre del Sprint *</label>
          <input 
            id="name"
            type="text" 
            pInputText 
            [(ngModel)]="formData.name"
            placeholder="Ej: Sprint 1"
            [maxlength]="100"
            class="w-full"
          />
        </div>

        <div class="field mb-3">
          <label for="goal" class="font-bold">Objetivo del Sprint</label>
          <textarea 
            id="goal"
            pInputTextarea 
            [(ngModel)]="formData.goal"
            placeholder="Describe el objetivo principal de este sprint"
            [rows]="3"
            [maxlength]="500"
            class="w-full"
          ></textarea>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6">
            <div class="field mb-3">
              <label for="startDate" class="font-bold">Fecha de Inicio *</label>
              <p-calendar 
                id="startDate"
                [(ngModel)]="formData.startDate"
                dateFormat="yy-mm-dd"
                [showIcon]="true"
                [iconDisplay]="'input'"
                placeholder="Seleccionar fecha"
                class="w-full"
              ></p-calendar>
            </div>
          </div>

          <div class="col-12 md:col-6">
            <div class="field mb-3">
              <label for="endDate" class="font-bold">Fecha de Fin *</label>
              <p-calendar 
                id="endDate"
                [(ngModel)]="formData.endDate"
                dateFormat="yy-mm-dd"
                [showIcon]="true"
                [iconDisplay]="'input'"
                placeholder="Seleccionar fecha"
                [minDate]="formData.startDate"
                class="w-full"
              ></p-calendar>
            </div>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button 
          label="Cancelar" 
          icon="pi pi-times" 
          severity="secondary"
          [text]="true"
          (onClick)="onCancel()">
        </p-button>
        <p-button 
          label="Guardar" 
          icon="pi pi-check"
          [loading]="loading"
          [disabled]="!isFormValid()"
          (onClick)="onSave()">
        </p-button>
      </ng-template>
    </p-dialog>
  `
})
export class SprintDialogComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() projectId: string = '';
  @Input() sprint: Sprint | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() sprintSaved = new EventEmitter<Sprint>();

  loading: boolean = false;
  editMode: boolean = false;
  formData: {
    name: string;
    goal: string;
    startDate: Date | null;
    endDate: Date | null;
  } = {
    name: '',
    goal: '',
    startDate: null,
    endDate: null
  };

  constructor(
    private sprintService: SprintService,
    private toastService: ToastService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      this.editMode = !!this.sprint;
      if (this.sprint) {
        this.formData = {
          name: this.sprint.name,
          goal: this.sprint.goal || '',
          startDate: new Date(this.sprint.startDate),
          endDate: new Date(this.sprint.endDate)
        };
      } else {
        this.resetForm();
      }
    }
  }

  isFormValid(): boolean {
    return !!(
      this.formData.name.trim() &&
      this.formData.startDate &&
      this.formData.endDate &&
      this.formData.startDate <= this.formData.endDate
    );
  }

  onSave() {
    if (!this.isFormValid()) return;

    this.loading = true;
    const request: CreateSprintRequest = {
      name: this.formData.name.trim(),
      goal: this.formData.goal.trim() || undefined,
      startDate: this.formatDate(this.formData.startDate!),
      endDate: this.formatDate(this.formData.endDate!)
    };

    this.sprintService.create(this.projectId, request).subscribe({
      next: (sprint) => {
        this.toastService.showSuccess('Éxito', 'Sprint creado correctamente');
        this.sprintSaved.emit(sprint);
        this.closeDialog();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating sprint:', error);
        this.toastService.showError('Error', 'No se pudo crear el sprint');
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.closeDialog();
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      name: '',
      goal: '',
      startDate: null,
      endDate: null
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

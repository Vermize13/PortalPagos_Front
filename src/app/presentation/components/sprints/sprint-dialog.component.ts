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
  templateUrl: './sprint-dialog.component.html'
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
  ) { }

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

    if (this.editMode && this.sprint) {
      // Update existing sprint
      const request = {
        name: this.formData.name.trim(),
        goal: this.formData.goal.trim() || undefined,
        startDate: this.formatDate(this.formData.startDate!),
        endDate: this.formatDate(this.formData.endDate!)
      };

      this.sprintService.update(this.sprint.id, request).subscribe({
        next: (sprint) => {
          this.toastService.showSuccess('Éxito', 'Sprint actualizado correctamente');
          this.sprintSaved.emit(sprint);
          this.closeDialog();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating sprint:', error);
          this.toastService.showError('Error', 'No se pudo actualizar el sprint');
          this.loading = false;
        }
      });
    } else {
      // Create new sprint
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

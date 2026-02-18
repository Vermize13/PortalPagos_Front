import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';
import { ProjectWithMembers, ProjectMemberDetail, Label, User, Permissions } from '../../../domain/models';
import { ProjectService, UpdateProjectRequest, AddProjectMemberRequest } from '../../../data/services/project.service';
import { LabelService, CreateLabelRequest } from '../../../data/services/label.service';
import { UserService } from '../../../data/services/user.service';
import { ToastService } from '../../../data/services/toast.service';
import { PermissionService } from '../../../data/services/permission.service';
import { SprintListComponent } from '../../components/sprints/sprint-list.component';

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    TabViewModule,
    TableModule,
    AvatarModule,
    AvatarGroupModule,
    ProgressSpinnerModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ColorPickerModule,
    CheckboxModule,
    ConfirmDialogModule,
    DropdownModule,
    SprintListComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  project: ProjectWithMembers | null = null;
  projectId: string = '';
  loading: boolean = false;
  members: ProjectMemberDetail[] = [];

  // Labels
  labels: Label[] = [];
  loadingLabels: boolean = false;
  displayLabelDialog: boolean = false;
  isEditingLabel: boolean = false;
  labelForm = {
    id: '',
    name: '',
    colorHex: '#3b82f6'
  };
  submittedLabel: boolean = false;

  // Edit project
  displayEditDialog: boolean = false;
  editProjectForm = {
    name: '',
    description: '',
    isActive: true
  };
  submittedProject: boolean = false;

  // Add member
  displayAddMemberDialog: boolean = false;
  allUsers: User[] = [];
  loadingUsers: boolean = false;
  selectedUser: User | null = null; // Track selected user to display their role
  addMemberForm = {
    userId: ''
  };
  submittedMember: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private labelService: LabelService,
    private userService: UserService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    public permissionService: PermissionService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.loadProject();
        this.loadLabels();
        this.loadMembers();
      }
    });
  }

  // Permission helper methods for template use
  canEditProject(): boolean {
    return this.permissionService.hasPermission(Permissions.PROJECT_UPDATE) ||
      this.permissionService.hasPermission(Permissions.PROJECT_MANAGE);
  }

  canAddMember(): boolean {
    return this.permissionService.hasPermission(Permissions.PROJECT_MEMBER_ADD) ||
      this.permissionService.hasPermission(Permissions.PROJECT_MANAGE);
  }

  canRemoveMember(): boolean {
    return this.permissionService.hasPermission(Permissions.PROJECT_MEMBER_REMOVE) ||
      this.permissionService.hasPermission(Permissions.PROJECT_MANAGE);
  }

  canManageLabels(): boolean {
    return this.permissionService.hasPermission(Permissions.PROJECT_UPDATE) ||
      this.permissionService.hasPermission(Permissions.PROJECT_MANAGE);
  }

  canManageSprints(): boolean {
    return this.permissionService.hasPermission(Permissions.SPRINT_CREATE) ||
      this.permissionService.hasPermission(Permissions.SPRINT_UPDATE);
  }

  loadProject() {
    this.loading = true;
    this.projectService.getById(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.loading = false;
        // Fallback to mock data for demonstration
        this.loadMockProject();
      }
    });
  }

  loadMembers() {
    this.projectService.getMembers(this.projectId).subscribe({
      next: (members) => {
        this.members = members.map(m => ({
          ...m,
          userName: m.userName || m.user?.name || 'Unknown',
          userEmail: m.userEmail || m.user?.email || '',
          roleName: m.roleName || m.role?.name || 'Member'
        }));
      },
      error: (error) => {
        console.error('Error loading members:', error);
      }
    });
  }

  loadMockProject() {
    this.project = {
      id: this.projectId,
      name: 'Martiniere Ticket Management System',
      code: 'MTMS',
      description: 'Sistema integral de gestión de tickets e incidencias para la organización. Permite administrar incidencias, realizar seguimiento, generar reportes y mantener un histórico completo de eventos.',
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
    if (this.project) {
      this.editProjectForm = {
        name: this.project.name,
        description: this.project.description || '',
        isActive: this.project.isActive
      };
      this.submittedProject = false;
      this.displayEditDialog = true;
    }
  }

  onSaveProject() {
    this.submittedProject = true;

    if (!this.editProjectForm.name) {
      return;
    }

    const updateRequest: UpdateProjectRequest = {
      name: this.editProjectForm.name,
      description: this.editProjectForm.description,
      isActive: this.editProjectForm.isActive
    };

    this.projectService.update(this.projectId, updateRequest).subscribe({
      next: () => {
        this.toastService.showSuccess('Éxito', 'Proyecto actualizado correctamente');
        this.displayEditDialog = false;
        this.loadProject();
      },
      error: (error) => {
        console.error('Error updating project:', error);
      }
    });
  }

  onCancelEdit() {
    this.displayEditDialog = false;
    this.submittedProject = false;
  }

  // Label management methods
  loadLabels() {
    this.loadingLabels = true;
    this.labelService.getByProject(this.projectId).subscribe({
      next: (labels) => {
        this.labels = labels;
        this.loadingLabels = false;
      },
      error: (error) => {
        console.error('Error loading labels:', error);
        this.loadingLabels = false;
      }
    });
  }

  onCreateLabel() {
    this.isEditingLabel = false;
    this.labelForm = {
      id: '',
      name: '',
      colorHex: '#3b82f6'
    };
    this.submittedLabel = false;
    this.displayLabelDialog = true;
  }

  onEditLabel(label: Label) {
    this.isEditingLabel = true;
    this.labelForm = {
      id: label.id,
      name: label.name,
      colorHex: label.colorHex || '#3b82f6'
    };
    this.submittedLabel = false;
    this.displayLabelDialog = true;
  }

  onSaveLabel() {
    this.submittedLabel = true;

    if (!this.labelForm.name.trim()) {
      return;
    }

    if (this.isEditingLabel) {
      this.toastService.showInfo('Información', 'La edición de etiquetas estará disponible próximamente');
      this.displayLabelDialog = false;
    } else {
      const request: CreateLabelRequest = {
        projectId: this.projectId,
        name: this.labelForm.name.trim(),
        colorHex: this.labelForm.colorHex
      };

      this.labelService.create(request).subscribe({
        next: () => {
          this.toastService.showSuccess('Éxito', 'Etiqueta creada correctamente');
          this.displayLabelDialog = false;
          this.loadLabels();
        },
        error: (error) => {
          console.error('Error creating label:', error);
        }
      });
    }
  }

  onDeleteLabel(label: Label) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar la etiqueta "${label.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.toastService.showInfo('Información', 'La eliminación de etiquetas estará disponible próximamente');
      }
    });
  }

  onCancelLabel() {
    this.displayLabelDialog = false;
    this.submittedLabel = false;
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

  // Member management methods
  onAddMember() {
    this.loadingUsers = true;
    this.displayAddMemberDialog = true;
    this.addMemberForm = {
      userId: ''
    };
    this.selectedUser = null;
    this.submittedMember = false;

    // Load all users
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Filter out users who are already members
        const memberUserIds = this.members.map(m => m.userId);
        this.allUsers = users.filter(u => !memberUserIds.includes(u.id) && u.isActive);
        this.loadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loadingUsers = false;
      }
    });
  }

  // Called when user is selected from dropdown
  onUserSelected(userId: string) {
    this.selectedUser = this.allUsers.find(u => u.id === userId) || null;
  }

  onSaveMember() {
    this.submittedMember = true;

    // Validate user is selected and has a role
    if (!this.addMemberForm.userId || !this.selectedUser?.role?.id) {
      if (!this.selectedUser?.role) {
        this.toastService.showError('Error', 'El usuario seleccionado no tiene un rol asignado');
      }
      return;
    }

    // Use the selected user's assigned role
    const request: AddProjectMemberRequest = {
      userId: this.addMemberForm.userId,
      roleId: this.selectedUser.role.id
    };

    this.projectService.addMember(this.projectId, request).subscribe({
      next: () => {
        this.toastService.showSuccess('Éxito', 'Miembro agregado correctamente');
        this.displayAddMemberDialog = false;
        this.selectedUser = null;
        this.loadMembers();
      },
      error: (error) => {
        console.error('Error adding member:', error);
      }
    });
  }

  onCancelMember() {
    this.displayAddMemberDialog = false;
    this.submittedMember = false;
  }

  onRemoveMember(member: ProjectMemberDetail) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar a "${member.userName}" del proyecto?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.projectService.removeMember(this.projectId, member.userId).subscribe({
          next: () => {
            this.toastService.showSuccess('Éxito', 'Miembro eliminado correctamente');
            this.loadMembers();
          },
          error: (error) => {
            console.error('Error removing member:', error);
          }
        });
      }
    });
  }
}

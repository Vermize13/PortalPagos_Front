import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { UserDisplay, RoleCode, Permissions } from '../../../domain/models';
import { User as DomainUser } from '../../../domain/models/user.model';
import { UserService, CreateUserRequest, UpdateUserRequest, BaseUserRequest } from '../../../data/services/user.service';
import { ToastService } from '../../../data/services/toast.service';
import { PermissionService } from '../../../data/services/permission.service';

interface UserFormData {
  id?: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  roleId: string;
  isActive: boolean;
}

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CardModule, 
    TableModule, 
    ButtonModule, 
    TagModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [ConfirmationService],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: UserDisplay[] = [];
  loading: boolean = false;
  
  // Dialog state
  displayDialog: boolean = false;
  isEditMode: boolean = false;
  submitted: boolean = false;
  saving: boolean = false;
  
  // Form data
  userForm: UserFormData = {
    name: '',
    email: '',
    username: '',
    password: '',
    roleId: '',
    isActive: true
  };
  
  // Role options
  roles = [
    { label: 'Administrador General', value: RoleCode.Admin },
    { label: 'Scrum Master', value: RoleCode.ScrumMaster },
    { label: 'Product Owner', value: RoleCode.ProductOwner },
    { label: 'Stakeholder', value: RoleCode.Stakeholder },
    { label: 'Líder Técnico', value: RoleCode.TechLead },
    { label: 'Desarrollador', value: RoleCode.Developer },
    { label: 'QA/Tester', value: RoleCode.Tester }
  ];

  private readonly roleSynonyms: Record<string, RoleCode> = {
    administradorgeneral: RoleCode.Admin,
    administrador: RoleCode.Admin,
    admin: RoleCode.Admin,
    scrummaster: RoleCode.ScrumMaster,
    productowner: RoleCode.ProductOwner,
    stakeholder: RoleCode.Stakeholder,
    lidertecnico: RoleCode.TechLead,
    techlead: RoleCode.TechLead,
    desarrollador: RoleCode.Developer,
    developer: RoleCode.Developer,
    tester: RoleCode.Tester,
    qatester: RoleCode.Tester,
    qa: RoleCode.Tester
  };

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private router: Router,
    public permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Permission helper methods for template use
  canCreateUser(): boolean {
    return this.permissionService.hasPermission(Permissions.USER_CREATE) ||
           this.permissionService.hasPermission(Permissions.USER_MANAGE);
  }

  canEditUser(): boolean {
    return this.permissionService.hasPermission(Permissions.USER_UPDATE) ||
           this.permissionService.hasPermission(Permissions.USER_MANAGE);
  }

  canDeleteUser(): boolean {
    return this.permissionService.hasPermission(Permissions.USER_DELETE) ||
           this.permissionService.hasPermission(Permissions.USER_MANAGE);
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: DomainUser[]) => {
        // Transform User[] to UserDisplay[]
        this.users = users.map(user => {
          const resolvedRole = user.role || user.roles?.[0];
          const roleCode = resolvedRole?.code || this.getRoleCodeFromLabel(resolvedRole?.name);
          const roleLabel = this.getRoleLabelFromCode(roleCode) || resolvedRole?.name || 'Sin rol';

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            primaryRole: roleLabel,
            primaryRoleCode: roleCode,
            isActive: user.isActive,
            createdAt: user.createdAt
          };
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastService.showError('Error', this.resolveApiErrorMessage(error, 'No se pudieron cargar los usuarios'));
        this.loading = false;
        // Fallback to mock data on error
        this.loadMockUsers();
      }
    });
  }

  loadMockUsers() {
    // Mock data for demonstration - using Guid format
    this.users = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        username: 'admin',
        email: 'admin@example.com',
        name: 'Admin User',
        primaryRole: this.getRoleLabelFromCode(RoleCode.Admin) ?? 'Administrador General',
        primaryRoleCode: RoleCode.Admin,
        isActive: true,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        username: 'developer1',
        email: 'developer1@example.com',
        name: 'John Developer',
        primaryRole: this.getRoleLabelFromCode(RoleCode.Developer) ?? 'Desarrollador',
        primaryRoleCode: RoleCode.Developer,
        isActive: true,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        username: 'tester1',
        email: 'tester1@example.com',
        name: 'Jane Tester',
        primaryRole: this.getRoleLabelFromCode(RoleCode.Tester) ?? 'QA/Tester',
        primaryRoleCode: RoleCode.Tester,
        isActive: true,
        createdAt: new Date('2024-02-01')
      }
    ];
  }

  getRoleSeverity(roleCode?: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (roleCode) {
      case RoleCode.Admin:
        return 'danger';
      case RoleCode.ProductOwner:
      case RoleCode.ScrumMaster:
        return 'warning';
      case RoleCode.TechLead:
      case RoleCode.Developer:
        return 'info';
      case RoleCode.Tester:
        return 'success';
      case RoleCode.Stakeholder:
        return 'secondary';
      default:
        return 'info';
    }
  }

  getStatusSeverity(isActive: boolean): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    return isActive ? 'success' : 'danger';
  }

  onViewProfile(user: UserDisplay) {
    this.router.navigate(['/inicio/profile', user.id]);
  }

  onEdit(user: UserDisplay) {
    this.isEditMode = true;
    this.submitted = false;
    this.userForm = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      password: '',
      roleId: user.primaryRoleCode || this.getRoleCodeFromLabel(user.primaryRole) || '',
      isActive: user.isActive
    };
    this.displayDialog = true;
  }

  onDelete(user: UserDisplay) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el usuario ${user.name}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.loading = true;
        this.userService.deleteUser(user.id).pipe(
          finalize(() => {
            this.loading = false;
          })
        ).subscribe({
          next: () => {
            this.toastService.showSuccess('Éxito', `Usuario ${user.name} eliminado correctamente`);
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.toastService.showError('Error', this.resolveApiErrorMessage(error, 'No se pudo eliminar el usuario'));
          }
        });
      }
    });
  }

  onCreate() {
    this.isEditMode = false;
    this.submitted = false;
    this.saving = false;
    this.resetForm();
    this.displayDialog = true;
  }
  
  onSaveUser() {
    this.submitted = true;
    
    if (!this.validateForm()) {
      this.toastService.showError('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    const baseRequest = this.buildBaseRequest();

    if (this.isEditMode && this.userForm.id) {
      const updateRequest: UpdateUserRequest = { ...baseRequest };
      const trimmedPassword = this.userForm.password?.trim();
      if (trimmedPassword) {
        updateRequest.password = trimmedPassword;
      }

      this.saving = true;
      this.userService.updateUser(this.userForm.id, updateRequest).pipe(
        finalize(() => {
          this.saving = false;
        })
      ).subscribe({
        next: () => {
          this.toastService.showSuccess('Éxito', 'Usuario actualizado correctamente');
          this.afterSuccessfulSave();
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.toastService.showError('Error', this.resolveApiErrorMessage(error, 'No se pudo actualizar el usuario'));
        }
      });
      return;
    }

    const createRequest: CreateUserRequest = {
      ...baseRequest,
      password: this.userForm.password!.trim()
    };

    this.saving = true;
    this.userService.createUser(createRequest).pipe(
      finalize(() => {
        this.saving = false;
      })
    ).subscribe({
      next: () => {
        this.toastService.showSuccess('Éxito', 'Usuario creado correctamente');
        this.afterSuccessfulSave();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.toastService.showError('Error', this.resolveApiErrorMessage(error, 'No se pudo crear el usuario'));
      }
    });
  }
  
  onCancelDialog() {
    this.displayDialog = false;
    this.submitted = false;
    this.saving = false;
    this.resetForm();
  }
  
  validateForm(): boolean {
    if (!this.userForm.name?.trim() || !this.userForm.email?.trim() || !this.userForm.username?.trim() || !this.userForm.roleId) {
      return false;
    }

    if (!this.isEditMode) {
      const password = this.userForm.password?.trim();
      if (!password || password.length < 6) {
        return false;
      }
    }

    return true;
  }

  private buildBaseRequest(): BaseUserRequest {
    return {
      name: this.userForm.name.trim(),
      email: this.userForm.email.trim(),
      username: this.userForm.username.trim(),
      roleCode: this.userForm.roleId,
      isActive: this.userForm.isActive
    };
  }

  private afterSuccessfulSave(): void {
    this.displayDialog = false;
    this.submitted = false;
    this.saving = false;
    this.isEditMode = false;
    this.resetForm();
    this.loadUsers();
  }

  private resolveApiErrorMessage(error: unknown, fallback: string): string {
    if (!error || typeof error !== 'object') {
      return fallback;
    }

    const httpError = error as { error?: unknown; message?: string };

    if (httpError.error) {
      if (typeof httpError.error === 'string') {
        return httpError.error;
      }

      const errorMessage = (httpError.error as { message?: string })?.message;
      if (errorMessage) {
        return errorMessage;
      }

      const errorTitle = (httpError.error as { title?: string })?.title;
      if (errorTitle) {
        return errorTitle;
      }

      const validationErrors = (httpError.error as { errors?: Record<string, string[]> })?.errors;
      if (validationErrors) {
        const firstError = Object.values(validationErrors).find(messages => Array.isArray(messages) && messages.length > 0);
        if (firstError && firstError[0]) {
          return firstError[0];
        }
      }
    }

    if (httpError.message) {
      return httpError.message;
    }

    return fallback;
  }

  private getRoleLabelFromCode(code?: string): string | undefined {
    if (!code) {
      return undefined;
    }
    return this.roles.find(role => role.value === code)?.label;
  }

  private getRoleCodeFromLabel(label?: string): string | undefined {
    if (!label) {
      return undefined;
    }
    const normalizedLabel = this.normalizeText(label);
    const collapsed = normalizedLabel.replace(/\s+/g, '');

    const synonymMatch = this.roleSynonyms[collapsed];
    if (synonymMatch) {
      return synonymMatch;
    }

    return this.roles.find(role => this.normalizeText(role.label) === normalizedLabel)?.value;
  }

  private normalizeText(value?: string): string {
    if (!value) {
      return '';
    }
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  private resetForm(): void {
    this.userForm = {
      id: undefined,
      name: '',
      email: '',
      username: '',
      password: '',
      roleId: '',
      isActive: true
    };
  }
}

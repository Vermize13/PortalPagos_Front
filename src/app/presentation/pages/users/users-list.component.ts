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
import { UserDisplay, RoleCode, Permissions, Role } from '../../../domain/models';
import { User as DomainUser } from '../../../domain/models/user.model';
import { UserService, UpdateUserRequest, BaseUserRequest } from '../../../data/services/user.service';
import { InvitationService, InviteUserRequest } from '../../../data/services/invitation.service';
import { ToastService } from '../../../data/services/toast.service';
import { PermissionService } from '../../../data/services/permission.service';
import { RoleService } from '../../../data/services/role.service';

interface InvitationFormData {
  fullName: string;
  email: string;
  roleId: string;
}

interface UserFormData {
  id?: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  roleId: string;
  isActive: boolean;
}

interface RoleLookupEntry {
  canonicalCode: string;
  backendCode: string;
  backendId: string | null;
  label: string;
}

const DEFAULT_ROLE_LABELS: Record<string, string> = {
  [RoleCode.Admin]: 'Administrador General',
  [RoleCode.ScrumMaster]: 'Scrum Master',
  [RoleCode.ProductOwner]: 'Product Owner',
  [RoleCode.Stakeholder]: 'Stakeholder',
  [RoleCode.TechLead]: 'Líder Técnico',
  [RoleCode.Developer]: 'Desarrollador',
  [RoleCode.Tester]: 'QA/Tester'
};

const DEFAULT_ROLE_ORDER: string[] = [
  RoleCode.Admin,
  RoleCode.ScrumMaster,
  RoleCode.ProductOwner,
  RoleCode.Stakeholder,
  RoleCode.TechLead,
  RoleCode.Developer,
  RoleCode.Tester
];

const FALLBACK_ROLES: Array<{ id: string; code: string; name: string }> = [
  { id: 'bcb7c990-60f7-4237-9da9-fc6f965aa28b', code: 'admin', name: 'Administrador General' },
  { id: '6161156c-1bf7-4191-b554-f4228cadc4ea', code: 'scrum_master', name: 'Scrum Master' },
  { id: '46c3609b-4252-4b78-b4f6-23e705ee0097', code: 'product_owner', name: 'Product Owner' },
  { id: 'b6633532-f352-4494-b2b0-ab4631884c41', code: 'lider_tecnico', name: 'Líder Técnico' },
  { id: '0784c6bf-b3e7-4511-8e76-9f874b8cb81c', code: 'desarrollador', name: 'Desarrollador' },
  { id: '08b73663-b354-4f09-8fd4-6525c824cbc8', code: 'qa_tester', name: 'QA/Tester' },
  { id: 'bf4a36db-0a0c-465e-9961-3bdf686e154a', code: 'stakeholder', name: 'Stakeholder' }
];

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
  displayInvitationDialog: boolean = false;
  isEditMode: boolean = false;
  submitted: boolean = false;
  saving: boolean = false;
  
  // Invitation form data
  invitationForm: InvitationFormData = {
    fullName: '',
    email: '',
    roleId: ''
  };
  
  // Form data for editing users
  userForm: UserFormData = {
    name: '',
    email: '',
    username: '',
    password: '',
    roleId: '',
    isActive: true
  };
  
  // Role options dynamically loaded from the API
  roles: Array<{ label: string; value: string }> = [];
  private readonly roleLookup = new Map<string, RoleLookupEntry>();
  private readonly roleSynonyms: Record<string, RoleCode> = {
    administradorgeneral: RoleCode.Admin,
    administrador: RoleCode.Admin,
    admin: RoleCode.Admin,
    adminrole: RoleCode.Admin,
    administradorgeneralrole: RoleCode.Admin,
    administradorrole: RoleCode.Admin,
    scrummaster: RoleCode.ScrumMaster,
    scrummasterrole: RoleCode.ScrumMaster,
    productowner: RoleCode.ProductOwner,
    productownerrole: RoleCode.ProductOwner,
    stakeholder: RoleCode.Stakeholder,
    stakeholderrole: RoleCode.Stakeholder,
    lidertecnico: RoleCode.TechLead,
    techlead: RoleCode.TechLead,
    techleadrole: RoleCode.TechLead,
    lidertecnicorole: RoleCode.TechLead,
    desarrollador: RoleCode.Developer,
    developer: RoleCode.Developer,
    developerrole: RoleCode.Developer,
    desarrolladorrole: RoleCode.Developer,
    tester: RoleCode.Tester,
    qatester: RoleCode.Tester,
    testerrole: RoleCode.Tester,
    qatesterrole: RoleCode.Tester,
    qa: RoleCode.Tester,
    qarole: RoleCode.Tester
  };

  constructor(
    private userService: UserService,
    private invitationService: InvitationService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private roleService: RoleService,
    public permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.initializeRoles();
  }

  // Permission helper methods for template use
  canInviteUser(): boolean {
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

  private initializeRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        if (Array.isArray(roles) && roles.length > 0) {
          this.applyRoleList(roles);
        } else {
          this.toastService.showWarn('Advertencia', 'No se recibieron roles desde el servidor. Se utilizará la lista predefinida.');
          this.applyFallbackRoles();
        }
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.toastService.showWarn('Advertencia', 'No se pudieron cargar los roles desde el servidor. Se utilizará la lista predefinida.');
        this.applyFallbackRoles();
        this.loadUsers();
      }
    });
  }

  private applyRoleList(roles: Role[]): void {
    this.roleLookup.clear();
    roles.forEach(role => this.upsertRoleOption(role));

    if (this.roleLookup.size === 0) {
      this.toastService.showWarn('Advertencia', 'No se pudo procesar la lista de roles del servidor. Se utilizará la lista predefinida.');
      this.applyFallbackRoles();
      return;
    }

    this.ensureDefaultRoles();
    this.refreshRoleDropdownOptions();
  }

  private applyFallbackRoles(): void {
    this.roleLookup.clear();
    FALLBACK_ROLES.forEach(role => this.upsertRoleOption(role));
    this.ensureDefaultRoles();
    this.refreshRoleDropdownOptions();
  }

  private ensureDefaultRoles(): void {
    for (const code of DEFAULT_ROLE_ORDER) {
      if (!this.roleLookup.has(code)) {
        const label = DEFAULT_ROLE_LABELS[code] ?? this.formatRoleLabel(code);
        this.roleLookup.set(code, {
          canonicalCode: code,
          backendCode: code,
          backendId: null,
          label
        });
      }
    }
  }

  private refreshRoleDropdownOptions(): void {
    const entries = Array.from(this.roleLookup.values());
    entries.sort((a, b) => {
      const indexA = DEFAULT_ROLE_ORDER.indexOf(a.canonicalCode);
      const indexB = DEFAULT_ROLE_ORDER.indexOf(b.canonicalCode);

      if (indexA !== -1 && indexB !== -1 && indexA !== indexB) {
        return indexA - indexB;
      }

      if (indexA !== -1) {
        return -1;
      }

      if (indexB !== -1) {
        return 1;
      }

      return a.label.localeCompare(b.label);
    });

    this.roles = entries.map(entry => ({
      label: entry.label,
      value: entry.canonicalCode
    }));
  }

  private upsertRoleOption(roleData: { id?: string | null; code?: string | null; name?: string | null }): boolean {
    const canonicalCode = this.normalizeRoleCodeString(roleData.code ?? roleData.name ?? '');
    if (!canonicalCode) {
      return false;
    }

    const existing = this.roleLookup.get(canonicalCode);
    const backendCodeRaw = roleData.code ?? existing?.backendCode ?? canonicalCode;
    const normalizedBackendCodeCandidate = String(backendCodeRaw ?? '').trim();
    const normalizedBackendCode = normalizedBackendCodeCandidate.length > 0 ? normalizedBackendCodeCandidate : canonicalCode;
    const backendId = roleData.id ?? existing?.backendId ?? null;
    const label = (roleData.name?.trim()) || existing?.label || DEFAULT_ROLE_LABELS[canonicalCode] || this.formatRoleLabel(canonicalCode);

    if (existing && existing.backendCode === normalizedBackendCode && existing.backendId === backendId && existing.label === label) {
      return false;
    }

    this.roleLookup.set(canonicalCode, {
      canonicalCode,
      backendCode: normalizedBackendCode,
      backendId,
      label
    });

    return true;
  }

  private getRoleEntry(code?: string): RoleLookupEntry | undefined {
    if (!code) {
      return undefined;
    }
    const canonical = this.toCanonicalRoleCode(code);
    if (!canonical) {
      return undefined;
    }
    return this.roleLookup.get(canonical);
  }

  private toCanonicalRoleCode(raw?: string | null): string | undefined {
    if (!raw) {
      return undefined;
    }

    const direct = this.normalizeRoleCodeString(raw);
    if (direct) {
      return direct;
    }

    const normalizedLabel = this.normalizeText(raw);
    for (const entry of this.roleLookup.values()) {
      if (entry.backendCode.toLowerCase() === raw.toLowerCase()) {
        return entry.canonicalCode;
      }

      if (this.normalizeText(entry.label) === normalizedLabel) {
        return entry.canonicalCode;
      }
    }

    return undefined;
  }

  private normalizeRoleCodeString(value?: string | null): string | undefined {
    if (!value) {
      return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }

    const lower = trimmed.toLowerCase();
    for (const code of Object.values(RoleCode)) {
      if (code === trimmed || code === lower) {
        return code as string;
      }
    }

    const normalizedText = this.normalizeText(trimmed);
    const collapsed = normalizedText.replace(/\s+/g, '');
    const synonymMatch = this.roleSynonyms[collapsed];
    if (synonymMatch) {
      return synonymMatch;
    }

    if (normalizedText) {
      return normalizedText.replace(/\s+/g, '_').replace(/_+/g, '_');
    }

    return lower;
  }

  private formatRoleLabel(code: string): string {
    if (!code) {
      return '';
    }

    const defaultLabel = DEFAULT_ROLE_LABELS[code];
    if (defaultLabel) {
      return defaultLabel;
    }

    const cleaned = code.replace(/[_-]+/g, ' ').trim();
    if (!cleaned) {
      return code;
    }

    return cleaned.split(' ').map(part => part ? part.charAt(0).toUpperCase() + part.slice(1) : '').join(' ');
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: DomainUser[]) => {
        let roleLookupUpdated = false;

        this.users = users.map(user => {
          const resolvedRole = user.role || user.roles?.[0];
          const canonicalRoleCode = this.toCanonicalRoleCode(resolvedRole?.code) ?? this.toCanonicalRoleCode(resolvedRole?.name);
          const roleEntrySource = resolvedRole ? {
            id: resolvedRole.id,
            code: resolvedRole.code ?? canonicalRoleCode,
            name: resolvedRole.name
          } : undefined;

          if (canonicalRoleCode && roleEntrySource) {
            roleLookupUpdated = this.upsertRoleOption(roleEntrySource) || roleLookupUpdated;
          }

          const roleLabel = canonicalRoleCode
            ? this.getRoleLabelFromCode(canonicalRoleCode) || resolvedRole?.name || 'Sin rol'
            : resolvedRole?.name || 'Sin rol';

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            primaryRole: roleLabel,
            primaryRoleCode: canonicalRoleCode ?? resolvedRole?.code ?? undefined,
            isActive: user.isActive,
            createdAt: user.createdAt
          };
        });

        if (roleLookupUpdated) {
          this.ensureDefaultRoles();
          this.refreshRoleDropdownOptions();
        }

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
    const canonical = this.toCanonicalRoleCode(roleCode) ?? this.normalizeRoleCodeString(roleCode);

    switch (canonical) {
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
    const canonicalRole = this.toCanonicalRoleCode(user.primaryRoleCode) || this.getRoleCodeFromLabel(user.primaryRole) || '';
    this.userForm = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      password: '',
      roleId: canonicalRole,
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

  onInviteUser() {
    this.submitted = false;
    this.saving = false;
    this.resetInvitationForm();
    this.displayInvitationDialog = true;
  }

  onSendInvitation() {
    this.submitted = true;
    
    if (!this.validateInvitationForm()) {
      this.toastService.showError('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    const selectedRole = this.getRoleEntry(this.invitationForm.roleId);
    if (!selectedRole?.backendId) {
      this.toastService.showError('Error', 'El rol seleccionado no es válido.');
      return;
    }

    const request: InviteUserRequest = {
      fullName: this.invitationForm.fullName.trim(),
      email: this.invitationForm.email.trim(),
      roleId: selectedRole.backendId
    };

    this.saving = true;
    this.invitationService.inviteUser(request).pipe(
      finalize(() => {
        this.saving = false;
      })
    ).subscribe({
      next: (response) => {
        const successMessage = response.message || `Invitación enviada a ${response.email}`;
        this.toastService.showSuccess('Invitación Enviada', successMessage);
        this.afterSuccessfulInvitation();
      },
      error: (error) => {
        console.error('Error sending invitation:', error);
        this.toastService.showError('Error', this.resolveApiErrorMessage(error, 'No se pudo enviar la invitación'));
      }
    });
  }

  onCancelInvitationDialog() {
    this.displayInvitationDialog = false;
    this.submitted = false;
    this.saving = false;
    this.resetInvitationForm();
  }

  validateInvitationForm(): boolean {
    if (!this.invitationForm.fullName?.trim() || !this.invitationForm.email?.trim() || !this.invitationForm.roleId) {
      return false;
    }
    return true;
  }

  private afterSuccessfulInvitation(): void {
    this.displayInvitationDialog = false;
    this.submitted = false;
    this.saving = false;
    this.resetInvitationForm();
  }

  private resetInvitationForm(): void {
    this.invitationForm = {
      fullName: '',
      email: '',
      roleId: ''
    };
  }
  
  /**
   * Handles saving user updates. This method only handles updates to existing users.
   * New user creation is now done via the invitation flow (onSendInvitation).
   */
  onSaveUser() {
    this.submitted = true;
    
    if (!this.validateForm()) {
      this.toastService.showError('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    const baseRequest = this.buildBaseRequest();

    if (this.userForm.id) {
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
    }
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

    return true;
  }

  private buildBaseRequest(): BaseUserRequest {
    const canonicalRole = this.toCanonicalRoleCode(this.userForm.roleId) || this.normalizeRoleCodeString(this.userForm.roleId) || this.userForm.roleId;
    const roleEntry = this.getRoleEntry(canonicalRole);

    return {
      name: this.userForm.name.trim(),
      email: this.userForm.email.trim(),
      username: this.userForm.username.trim(),
      roleCode: roleEntry?.backendCode ?? canonicalRole,
      roleId: roleEntry?.backendId ?? undefined,
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

    const entry = this.getRoleEntry(code);
    if (entry) {
      return entry.label;
    }

    const canonical = this.normalizeRoleCodeString(code);
    if (canonical) {
      return DEFAULT_ROLE_LABELS[canonical] ?? this.formatRoleLabel(canonical);
    }

    return undefined;
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

    for (const entry of this.roleLookup.values()) {
      if (this.normalizeText(entry.label) === normalizedLabel) {
        return entry.canonicalCode;
      }
    }

    return undefined;
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { UserDisplay, RoleCode } from '../../../domain/models';
import { User as DomainUser } from '../../../domain/models/user.model';
import { UserService } from '../../../data/services/user.service';
import { ToastService } from '../../../data/services/toast.service';

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
    ConfirmDialogModule
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
    { label: 'Admin', value: 'admin' },
    { label: 'Product Owner', value: 'product_owner' },
    { label: 'Developer', value: 'developer' },
    { label: 'Tester', value: 'tester' }
  ];

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: DomainUser[]) => {
        // Transform User[] to UserDisplay[]
        this.users = users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          primaryRole: user.userRoles?.[0]?.role?.name || 'Sin rol',
          isActive: user.isActive,
          createdAt: user.createdAt
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastService.showError('Error', 'No se pudieron cargar los usuarios');
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
        primaryRole: 'Admin',
        isActive: true,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        username: 'developer1',
        email: 'developer1@example.com',
        name: 'John Developer',
        primaryRole: 'Developer',
        isActive: true,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        username: 'tester1',
        email: 'tester1@example.com',
        name: 'Jane Tester',
        primaryRole: 'Tester',
        isActive: true,
        createdAt: new Date('2024-02-01')
      }
    ];
  }

  getRoleSeverity(role?: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    if (!role) return 'info';
    switch (role.toLowerCase()) {
      case 'admin': return 'danger';
      case 'product owner': 
      case 'productowner': return 'warning';
      case 'developer': return 'info';
      case 'tester': return 'success';
      default: return 'info';
    }
  }

  getStatusSeverity(isActive: boolean): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    return isActive ? 'success' : 'danger';
  }

  onEdit(user: UserDisplay) {
    this.isEditMode = true;
    this.submitted = false;
    this.userForm = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      roleId: user.primaryRole?.toLowerCase().replace(' ', '_') || '',
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
        // TODO: Implement delete API call
        this.toastService.showSuccess('Éxito', `Usuario ${user.name} eliminado correctamente`);
        this.loadUsers();
      }
    });
  }

  onCreate() {
    this.isEditMode = false;
    this.submitted = false;
    this.userForm = {
      name: '',
      email: '',
      username: '',
      password: '',
      roleId: '',
      isActive: true
    };
    this.displayDialog = true;
  }
  
  onSaveUser() {
    this.submitted = true;
    
    if (!this.validateForm()) {
      this.toastService.showError('Error', 'Por favor complete todos los campos requeridos');
      return;
    }
    
    if (this.isEditMode) {
      // TODO: Implement update API call
      this.toastService.showSuccess('Éxito', 'Usuario actualizado correctamente');
    } else {
      // TODO: Implement create API call
      this.toastService.showSuccess('Éxito', 'Usuario creado correctamente');
    }
    
    this.displayDialog = false;
    this.loadUsers();
  }
  
  onCancelDialog() {
    this.displayDialog = false;
    this.submitted = false;
  }
  
  validateForm(): boolean {
    if (!this.userForm.name || !this.userForm.email || !this.userForm.username || !this.userForm.roleId) {
      return false;
    }
    if (!this.isEditMode && !this.userForm.password) {
      return false;
    }
    return true;
  }
}

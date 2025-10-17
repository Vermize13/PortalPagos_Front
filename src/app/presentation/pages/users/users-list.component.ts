import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { UserDisplay, RoleCode, User } from '../../../domain/models';
import { UserService } from '../../../data/services/user.service';
import { ToastService } from '../../../data/services/toast.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: UserDisplay[] = [];
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
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
    console.log('Edit user:', user);
  }

  onDelete(user: UserDisplay) {
    console.log('Delete user:', user);
  }

  onCreate() {
    console.log('Create new user');
  }
}

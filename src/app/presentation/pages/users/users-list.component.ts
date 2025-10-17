import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { User, UserRole, UserStatus } from '../../../domain/models';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    // Mock data for demonstration
    this.users = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        globalRole: UserRole.Admin,
        status: UserStatus.Active,
        createdAt: new Date('2024-01-01')
      },
      {
        id: 2,
        username: 'developer1',
        email: 'developer1@example.com',
        firstName: 'John',
        lastName: 'Developer',
        globalRole: UserRole.Developer,
        status: UserStatus.Active,
        createdAt: new Date('2024-01-15')
      },
      {
        id: 3,
        username: 'tester1',
        email: 'tester1@example.com',
        firstName: 'Jane',
        lastName: 'Tester',
        globalRole: UserRole.Tester,
        status: UserStatus.Active,
        createdAt: new Date('2024-02-01')
      }
    ];
    this.loading = false;
  }

  getRoleSeverity(role: UserRole): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (role) {
      case UserRole.Admin: return 'danger';
      case UserRole.ProductOwner: return 'warning';
      case UserRole.Developer: return 'info';
      case UserRole.Tester: return 'success';
      default: return 'info';
    }
  }

  getStatusSeverity(status: UserStatus): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case UserStatus.Active: return 'success';
      case UserStatus.Inactive: return 'warning';
      case UserStatus.Suspended: return 'danger';
      default: return 'info';
    }
  }

  onEdit(user: User) {
    console.log('Edit user:', user);
  }

  onDelete(user: User) {
    console.log('Delete user:', user);
  }

  onCreate() {
    console.log('Create new user');
  }
}

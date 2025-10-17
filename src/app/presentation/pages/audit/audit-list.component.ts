import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AuditLogWithUser, AuditAction } from '../../../domain/models';
import { AuditService } from '../../../data/services/audit.service';
import { ToastService } from '../../../data/services/toast.service';

@Component({
  selector: 'app-audit-list',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TagModule],
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.css']
})
export class AuditListComponent implements OnInit {
  auditLogs: AuditLogWithUser[] = [];
  loading: boolean = false;

  constructor(
    private auditService: AuditService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadAuditLogs();
  }

  loadAuditLogs() {
    this.loading = true;
    this.auditService.getAll().subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        this.toastService.showError('Error', 'No se pudieron cargar los registros de auditoría');
        this.loading = false;
        // Fallback to mock data on error
        this.loadMockAuditLogs();
      }
    });
  }

  loadMockAuditLogs() {
    // Mock data for demonstration - using Guid format
    this.auditLogs = [
      {
        id: '950e8400-e29b-41d4-a716-446655440001',
        action: AuditAction.Login,
        actorId: '550e8400-e29b-41d4-a716-446655440001',
        actor: null,
        userName: 'Admin User',
        userEmail: 'admin@example.com',
        entityName: 'System',
        createdAt: new Date('2024-03-15T10:30:00')
      },
      {
        id: '950e8400-e29b-41d4-a716-446655440002',
        action: AuditAction.Create,
        actorId: '550e8400-e29b-41d4-a716-446655440002',
        actor: null,
        userName: 'John Developer',
        userEmail: 'developer1@example.com',
        entityName: 'Incident',
        entityId: '750e8400-e29b-41d4-a716-446655440001',
        detailsJson: '{"incidentCode":"PP-1"}',
        createdAt: new Date('2024-03-15T11:00:00')
      },
      {
        id: '950e8400-e29b-41d4-a716-446655440003',
        action: AuditAction.Assign,
        actorId: '550e8400-e29b-41d4-a716-446655440001',
        actor: null,
        userName: 'Admin User',
        userEmail: 'admin@example.com',
        entityName: 'Incident',
        entityId: '750e8400-e29b-41d4-a716-446655440001',
        detailsJson: '{"assignedTo":"Jane Tester"}',
        createdAt: new Date('2024-03-15T11:15:00')
      },
      {
        id: '950e8400-e29b-41d4-a716-446655440004',
        action: AuditAction.Transition,
        actorId: '550e8400-e29b-41d4-a716-446655440003',
        actor: null,
        userName: 'Jane Tester',
        userEmail: 'tester1@example.com',
        entityName: 'Incident',
        entityId: '750e8400-e29b-41d4-a716-446655440001',
        detailsJson: '{"from":"Open","to":"InProgress"}',
        createdAt: new Date('2024-03-15T12:00:00')
      }
    ];
  }

  getActionSeverity(action: AuditAction): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (action) {
      case AuditAction.Login: return 'info';
      case AuditAction.Create: return 'success';
      case AuditAction.Update: return 'warning';
      case AuditAction.Delete: return 'danger';
      case AuditAction.Transition: return 'info';
      case AuditAction.Backup: return 'secondary';
      case AuditAction.Restore: return 'warning';
      case AuditAction.Upload: return 'info';
      case AuditAction.Download: return 'info';
      default: return 'secondary';
    }
  }

  onExport() {
    console.log('Export audit logs');
  }
}

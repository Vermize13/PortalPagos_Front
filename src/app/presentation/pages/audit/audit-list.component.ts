import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AuditLogWithUser, AuditAction, AuditEntityType } from '../../../domain/models';

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

  ngOnInit() {
    this.loadAuditLogs();
  }

  loadAuditLogs() {
    this.loading = true;
    // Mock data for demonstration
    this.auditLogs = [
      {
        id: 1,
        userId: 1,
        userName: 'Admin User',
        userEmail: 'admin@example.com',
        action: AuditAction.Login,
        entityType: AuditEntityType.System,
        description: 'Usuario inició sesión',
        createdAt: new Date('2024-03-15T10:30:00')
      },
      {
        id: 2,
        userId: 2,
        userName: 'John Developer',
        userEmail: 'developer1@example.com',
        action: AuditAction.Create,
        entityType: AuditEntityType.Incident,
        entityId: 1,
        description: 'Creó la incidencia #1',
        createdAt: new Date('2024-03-15T11:00:00')
      },
      {
        id: 3,
        userId: 1,
        userName: 'Admin User',
        userEmail: 'admin@example.com',
        action: AuditAction.Assign,
        entityType: AuditEntityType.Incident,
        entityId: 1,
        description: 'Asignó la incidencia #1 a Jane Tester',
        createdAt: new Date('2024-03-15T11:15:00')
      },
      {
        id: 4,
        userId: 3,
        userName: 'Jane Tester',
        userEmail: 'tester1@example.com',
        action: AuditAction.StatusChange,
        entityType: AuditEntityType.Incident,
        entityId: 1,
        description: 'Cambió el estado de la incidencia #1 a In Progress',
        createdAt: new Date('2024-03-15T12:00:00')
      }
    ];
    this.loading = false;
  }

  getActionSeverity(action: AuditAction): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (action) {
      case AuditAction.Login: return 'info';
      case AuditAction.Create: return 'success';
      case AuditAction.Update: return 'warning';
      case AuditAction.Delete: return 'danger';
      case AuditAction.StatusChange: return 'info';
      default: return 'secondary';
    }
  }

  onExport() {
    console.log('Export audit logs');
  }
}

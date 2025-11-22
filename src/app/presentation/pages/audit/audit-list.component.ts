import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AuditLogWithUser, AuditAction } from '../../../domain/models';
import { AuditService, AuditLogFilter, AuditLogPagedResponse } from '../../../data/services/audit.service';
import { ToastService } from '../../../data/services/toast.service';
import * as XLSX from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-audit-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CardModule, 
    TableModule, 
    ButtonModule, 
    TagModule,
    DropdownModule,
    CalendarModule
  ],
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.css']
})
export class AuditListComponent implements OnInit {
  auditLogs: AuditLogWithUser[] = [];
  loading: boolean = false;
  
  // Pagination
  totalRecords: number = 0;
  currentPage: number = 1;
  pageSize: number = 20;
  
  // RF5.2: Filter properties
  filter: AuditLogFilter = {};
  selectedAction: AuditAction | null = null;
  selectedUserId: string | null = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  // Filter options
  actionOptions: { label: string; value: AuditAction }[] = [];

  constructor(
    private auditService: AuditService,
    private toastService: ToastService
  ) {
    // Initialize action options
    this.actionOptions = Object.values(AuditAction).map(action => ({
      label: this.getActionLabel(action),
      value: action
    }));
  }

  ngOnInit() {
    this.loadAuditLogs();
  }

  loadAuditLogs() {
    this.loading = true;
    
    // Build filter with pagination
    this.filter = {
      page: this.currentPage,
      pageSize: this.pageSize
    };
    
    if (this.selectedAction !== null) {
      this.filter.action = this.selectedAction;
    }
    if (this.selectedUserId) {
      this.filter.userId = this.selectedUserId;
    }
    if (this.startDate) {
      this.filter.startDate = this.startDate;
    }
    if (this.endDate) {
      this.filter.endDate = this.endDate;
    }

    this.auditService.getAll(this.filter).subscribe({
      next: (response: AuditLogPagedResponse) => {
        this.auditLogs = response.logs;
        this.totalRecords = response.totalCount;
        this.currentPage = response.page;
        this.pageSize = response.pageSize;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        this.toastService.showError('Error', 'No se pudieron cargar los registros de auditoría');
        this.loading = false;
        // Use mock data on error
        this.loadMockData();
      }
    });
  }

  loadMockData() {
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

  // RF5.2: Apply filters
  applyFilters() {
    this.loadAuditLogs();
  }

  // RF5.2: Clear filters
  clearFilters() {
    this.selectedAction = null;
    this.selectedUserId = null;
    this.startDate = null;
    this.endDate = null;
    this.currentPage = 1;
    this.filter = {};
    this.loadAuditLogs();
  }

  // Pagination methods
  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.loadAuditLogs();
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

  getActionLabel(action: AuditAction): string {
    const labels: { [key in AuditAction]: string } = {
      [AuditAction.Login]: 'Inicio de Sesión',
      [AuditAction.Logout]: 'Cierre de Sesión',
      [AuditAction.Create]: 'Crear',
      [AuditAction.Update]: 'Actualizar',
      [AuditAction.Delete]: 'Eliminar',
      [AuditAction.Assign]: 'Asignar',
      [AuditAction.Transition]: 'Cambio de Estado',
      [AuditAction.Upload]: 'Subir Archivo',
      [AuditAction.Download]: 'Descargar Archivo',
      [AuditAction.Backup]: 'Copia de Seguridad',
      [AuditAction.Restore]: 'Restaurar',
      [AuditAction.Export]: 'Exportar'
    };
    return labels[action] || action;
  }

  // RF5.3: Export audit logs
  async onExport() {
    try {
      this.loading = true;
      
      // Create a new workbook
      const workbook = new XLSX.Workbook();
      const worksheet = workbook.addWorksheet('Auditoría');

      // Add headers
      worksheet.columns = [
        { header: 'Fecha/Hora', key: 'createdAt', width: 20 },
        { header: 'Usuario', key: 'userName', width: 25 },
        { header: 'Email', key: 'userEmail', width: 30 },
        { header: 'Acción', key: 'action', width: 20 },
        { header: 'Entidad', key: 'entityName', width: 20 },
        { header: 'ID Entidad', key: 'entityId', width: 38 },
        { header: 'Detalles', key: 'detailsJson', width: 50 }
      ];

      // Add rows
      this.auditLogs.forEach(log => {
        worksheet.addRow({
          createdAt: log.createdAt,
          userName: log.userName || '-',
          userEmail: log.userEmail || '-',
          action: this.getActionLabel(log.action),
          entityName: log.entityName || '-',
          entityId: log.entityId || '-',
          detailsJson: log.detailsJson || '-'
        });
      });

      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Save file
      const fileName = `auditoria_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, fileName);

      this.toastService.showSuccess('Éxito', 'Registros de auditoría exportados correctamente');
      this.loading = false;
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      this.toastService.showError('Error', 'No se pudieron exportar los registros');
      this.loading = false;
    }
  }
}

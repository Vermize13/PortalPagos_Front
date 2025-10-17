export enum AuditAction {
  Login = 'Login',
  Logout = 'Logout',
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
  Assign = 'Assign',
  StatusChange = 'StatusChange',
  FileUpload = 'FileUpload',
  FileDownload = 'FileDownload',
  Export = 'Export'
}

export enum AuditEntityType {
  User = 'User',
  Project = 'Project',
  Sprint = 'Sprint',
  Incident = 'Incident',
  Comment = 'Comment',
  Attachment = 'Attachment',
  System = 'System'
}

export interface AuditLog {
  id: number;
  userId: number;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: number;
  description: string;
  metadata?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface AuditLogWithUser extends AuditLog {
  userName: string;
  userEmail: string;
}

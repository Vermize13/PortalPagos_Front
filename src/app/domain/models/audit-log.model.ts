export enum AuditAction {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
  Login = 'Login',
  Logout = 'Logout',
  Assign = 'Assign',
  Transition = 'Transition',
  Backup = 'Backup',
  Restore = 'Restore',
  Upload = 'Upload',
  Download = 'Download',
  Export = 'Export'
}

export enum AuditEntityType {
  User = 'User',
  Project = 'Project',
  Incident = 'Incident',
  Sprint = 'Sprint',
  Comment = 'Comment',
  Attachment = 'Attachment',
  Backup = 'Backup'
}

export interface AuditLog {
  id: string; // Guid
  action: AuditAction;
  actorId?: string; // Guid
  actor?: any; // User reference
  entityName?: string;
  entityId?: string; // Guid
  requestId?: string; // Guid
  ipAddress?: string;
  userAgent?: string;
  detailsJson?: string;
  createdAt: Date;
}

export interface AuditLogWithUser extends AuditLog {
  userName: string;
  userEmail: string;
}

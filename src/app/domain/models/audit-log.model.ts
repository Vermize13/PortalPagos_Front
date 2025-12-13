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
  action: string;
  actorId?: string; // Guid
  actorUsername?: string;
  entityName?: string;
  entityId?: string; // Guid
  ipAddress?: string;
  userAgent?: string;
  detailsJson?: string;
  createdAt: Date;
  httpMethod?: string;
  httpPath?: string;
  httpStatusCode?: number;
  durationMs?: number;
  sqlCommand?: string;
  sqlParameters?: string;
}

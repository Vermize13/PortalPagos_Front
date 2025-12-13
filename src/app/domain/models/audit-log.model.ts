export enum AuditAction {
  Login = 0,
  Logout = 1,
  Create = 2,
  Update = 3,
  Delete = 4,
  Assign = 5,
  Transition = 6,
  Backup = 7,
  Restore = 8,
  Upload = 9,
  Download = 10,
  Export = 11,
  Comment = 12
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

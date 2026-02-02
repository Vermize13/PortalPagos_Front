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
  Comment = 12,
  HttpRequest = 13,
  Unknown = 99
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

export enum IncidentStatus {
  Abierto = 0,
  EnProgreso = 1,
  Resuelto = 2,
  Cerrado = 3,
  Rechazado = 4,
  Duplicado = 5
}

export enum IncidentSeverity {
  Bajo = 0,
  Medio = 1,
  Alto = 2,
  Crítico = 3
}

export enum IncidentPriority {
  NoHacer = 0,
  PodríaHacer = 1,
  DeberíaHacer = 2,
  DebeHacer = 3
}

export interface Incident {
  id: string; // Guid
  projectId: string; // Guid
  project: any; // Project reference
  sprintId?: string; // Guid
  sprint?: any; // Sprint reference
  code: string;
  title: string;
  description?: string;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  status: IncidentStatus;
  reporterId: string; // Guid
  reporter: any; // User reference
  assigneeId?: string; // Guid
  assignee?: any; // User reference
  storyPoints?: number;
  dueDate?: string; // DateOnly in C# - use ISO string format
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  labels: IncidentLabel[];
  comments: IncidentComment[];
}

export interface Label {
  id: string; // Guid
  projectId: string; // Guid
  project: any; // Project reference
  name: string;
  colorHex?: string;
}

export interface IncidentLabel {
  incidentId: string; // Guid
  incident: any; // Incident reference
  labelId: string; // Guid
  label: any; // Label reference
}

export interface IncidentComment {
  id: string; // Guid
  incidentId: string; // Guid
  incident: any; // Incident reference
  authorId: string; // Guid
  author: any; // User reference
  body: string;
  createdAt: Date;
  editedAt?: Date;
}

export interface IncidentWithDetails extends Incident {
  reporterName?: string;
  assigneeName?: string;
  commentCount?: number;
  attachmentCount?: number;
}

export interface IncidentHistory {
  id: string; // Guid
  incidentId: string; // Guid
  incident?: any; // Incident reference
  changedBy: string; // Guid
  changedByUser?: any; // User reference
  fieldName: string;
  oldValue?: string;
  newValue?: string;
  changedAt: Date;
}

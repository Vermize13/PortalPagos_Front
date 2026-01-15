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

export enum BugType {
  Funcional = 0,
  Visual = 1,
  Performance = 2,
  Security = 3,
  Other = 4
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
  testData?: string;
  evidence?: string;
  expectedBehavior?: string;
  bugType?: BugType;
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

// LabelInfo is a simplified DTO returned by the API in IncidentResponse
// It contains only the essential label information without project references
export interface LabelInfo {
  id: string; // Guid
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

export interface IncidentWithDetails {
  id: string;
  projectId: string;
  projectName?: string;
  sprintId?: string;
  sprintName?: string;
  sprintNumber?: number;
  code: string;
  title: string;
  description?: string;
  testData?: string;
  evidence?: string;
  expectedBehavior?: string;
  bugType?: BugType;
  severity: IncidentSeverity;
  priority: IncidentPriority;
  status: IncidentStatus;
  reporterId: string;
  reporterName?: string;
  assigneeId?: string;
  assigneeName?: string;
  storyPoints?: number;
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  labels?: LabelInfo[];
  commentCount?: number;
  attachmentCount?: number;
  // Optional expanded references
  project?: any;
  sprint?: any;
  reporter?: any;
  assignee?: any;
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

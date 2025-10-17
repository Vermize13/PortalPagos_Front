export enum IncidentStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  Closed = 'Closed',
  Rejected = 'Rejected',
  Duplicated = 'Duplicated'
}

export enum IncidentSeverity {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum IncidentPriority {
  Wont = 'Wont',
  Could = 'Could',
  Should = 'Should',
  Must = 'Must'
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

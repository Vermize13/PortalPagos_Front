export enum IncidentStatus {
  New = 'New',
  InProgress = 'InProgress',
  InReview = 'InReview',
  Resolved = 'Resolved',
  Closed = 'Closed',
  Reopened = 'Reopened'
}

export enum IncidentPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export enum IncidentSeverity {
  Minor = 'Minor',
  Moderate = 'Moderate',
  Major = 'Major',
  Blocker = 'Blocker'
}

export interface Incident {
  id: number;
  projectId: number;
  sprintId?: number;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  severity: IncidentSeverity;
  reportedById: number;
  assignedToId?: number;
  createdAt: Date;
  updatedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;
}

export interface IncidentWithDetails extends Incident {
  projectName: string;
  sprintName?: string;
  reportedByName: string;
  assignedToName?: string;
  tags: string[];
  attachmentCount: number;
  commentCount: number;
}

export interface IncidentTag {
  id: number;
  incidentId: number;
  tag: string;
}

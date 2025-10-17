export enum SprintStatus {
  Planned = 'Planned',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface Sprint {
  id: number;
  projectId: number;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export interface SprintWithProject extends Sprint {
  projectName: string;
}

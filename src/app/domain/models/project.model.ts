export enum ProjectStatus {
  Active = 'Active',
  OnHold = 'OnHold',
  Completed = 'Completed',
  Archived = 'Archived'
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  ownerId: number;
}

export interface ProjectWithMembers extends Project {
  members: ProjectMemberDetail[];
}

export interface ProjectMemberDetail {
  userId: number;
  userName: string;
  userEmail: string;
  roleInProject: string;
  assignedAt: Date;
}

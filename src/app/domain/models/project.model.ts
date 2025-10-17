export interface Project {
  id: string; // Guid
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdBy: string; // Guid
  creator: any; // User reference
  createdAt: Date;
  updatedAt: Date;
  members: ProjectMember[];
}

export interface ProjectMember {
  projectId: string; // Guid
  project: any; // Project reference
  userId: string; // Guid
  user: any; // User reference
  roleId: string; // Guid
  role: any; // Role reference
  joinedAt: Date;
  isActive: boolean;
}

export interface ProjectWithMembers extends Project {
  memberDetails?: ProjectMemberDetail[];
}

export interface ProjectMemberDetail extends ProjectMember {
  userName?: string;
  userEmail?: string;
  roleName?: string;
}

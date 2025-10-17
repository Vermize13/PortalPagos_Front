export enum UserRole {
  Admin = 'Admin',
  ProductOwner = 'ProductOwner',
  Developer = 'Developer',
  Tester = 'Tester'
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended'
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  globalRole: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  profilePictureUrl?: string;
}

export interface ProjectMember {
  userId: number;
  projectId: number;
  roleInProject: UserRole;
  assignedAt: Date;
}

export interface UserProfile {
  userId: number;
  phone?: string;
  location?: string;
  bio?: string;
}

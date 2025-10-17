// Enum for common role codes - matches C# backend roles
export enum RoleCode {
  Admin = 'admin',
  ProductOwner = 'product_owner',
  Developer = 'developer',
  Tester = 'tester'
}

export interface User {
  id: string; // Guid
  name: string;
  email: string;
  username: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userRoles: UserRole[];
}

export interface Role {
  id: string; // Guid
  code: string;
  name: string;
  description?: string;
}

export interface UserRole {
  userId: string; // Guid
  user: User;
  roleId: string; // Guid
  role: Role;
  assignedAt: Date;
}

// Helper interface for displaying users with simplified role info
export interface UserDisplay {
  id: string;
  name: string;
  email: string;
  username: string;
  isActive: boolean;
  primaryRole?: string; // Primary role name for display
  createdAt: Date;
}

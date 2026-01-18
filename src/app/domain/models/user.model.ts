// Enum for common role codes - matches C# backend roles
export enum RoleCode {
  Admin = 'admin',
  ScrumMaster = 'scrum_master',
  ProductOwner = 'product_owner',
  Stakeholder = 'stakeholder',
  TechLead = 'tech_lead',
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
  role?: Role; // Single role per user (1:N relationship)
}

export interface Role {
  id: string; // Guid
  code: string;
  name: string;
  description?: string;
}

// Helper interface for displaying users with simplified role info
export interface UserDisplay {
  id: string;
  name: string;
  email: string;
  username: string;
  isActive: boolean;
  primaryRole?: string; // Primary role name for display
  primaryRoleCode?: string;
  createdAt: Date;
}

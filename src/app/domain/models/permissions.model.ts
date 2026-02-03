/**
 * Permission constants for the RBAC system.
 * These permissions are used throughout the application to control access to features.
 */
export const Permissions = {
  // Dashboard permissions
  DASHBOARD_ACCESS: 'dashboard-access',
  DASHBOARD_FULL: 'dashboard-full',

  // User management permissions
  USER_VIEW: 'user-view',
  USER_CREATE: 'user-create',
  USER_UPDATE: 'user-update',
  USER_DELETE: 'user-delete',
  USER_MANAGE: 'user-manage',

  // Project management permissions
  PROJECT_VIEW: 'project-view',
  PROJECT_CREATE: 'project-create',
  PROJECT_UPDATE: 'project-update',
  PROJECT_DELETE: 'project-delete',
  PROJECT_MANAGE: 'project-manage',
  PROJECT_MEMBER_ADD: 'project-member-add',
  PROJECT_MEMBER_REMOVE: 'project-member-remove',

  // Incident management permissions
  INCIDENT_VIEW: 'incident-view',
  INCIDENT_CREATE: 'incident-create',
  INCIDENT_TITLE_UPDATE: 'incident-title-update',
  INCIDENT_DESCRIPTION_UPDATE: 'incident-description-update',
  INCIDENT_LABEL_UPDATE: 'incident-label-update',
  INCIDENT_DATA_UPDATE: 'incident-data-update',
  INCIDENT_STATUS_UPDATE: 'incident-status-update',
  INCIDENT_ASSIGN: 'incident-assign',
  INCIDENT_CLOSE: 'incident-close',
  INCIDENT_COMMENT: 'incident-comment',
  INCIDENT_ATTACHMENT: 'incident-attachment',
  INCIDENT_FULL: 'incident-full',

  // Sprint management permissions
  SPRINT_VIEW: 'sprint-view',
  SPRINT_CREATE: 'sprint-create',
  SPRINT_UPDATE: 'sprint-update',
  SPRINT_DELETE: 'sprint-delete',
  SPRINT_CLOSE: 'sprint-close',

  // Audit permissions
  AUDIT_VIEW: 'audit-view',
  AUDIT_EXPORT: 'audit-export',

  // Backup permissions
  BACKUP_VIEW: 'backup-view',
  BACKUP_CREATE: 'backup-create',
  BACKUP_RESTORE: 'backup-restore',

  // Admin permissions
  ADMIN_ACCESS: 'admin-access',
  ADMIN_FULL: 'admin-full'
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

/**
 * Role definitions with their associated permissions.
 * Based on the project requirements for different team roles.
 */
export interface RoleConfig {
  name: string;
  code: string;
  description: string;
  permissions: Permission[];
}

export const RolesConfig: RoleConfig[] = [
  {
    name: 'Administrador General',
    code: 'admin',
    description: 'Full access to all features including user management, project management, dashboards, and incident management.',
    permissions: [
      Permissions.DASHBOARD_ACCESS,
      Permissions.DASHBOARD_FULL,
      Permissions.USER_VIEW,
      Permissions.USER_CREATE,
      Permissions.USER_UPDATE,
      Permissions.USER_DELETE,
      Permissions.USER_MANAGE,
      Permissions.PROJECT_VIEW,
      Permissions.PROJECT_CREATE,
      Permissions.PROJECT_UPDATE,
      Permissions.PROJECT_DELETE,
      Permissions.PROJECT_MANAGE,
      Permissions.PROJECT_MEMBER_ADD,
      Permissions.PROJECT_MEMBER_REMOVE,
      Permissions.INCIDENT_VIEW,
      Permissions.INCIDENT_CREATE,
      Permissions.INCIDENT_TITLE_UPDATE,
      Permissions.INCIDENT_DESCRIPTION_UPDATE,
      Permissions.INCIDENT_LABEL_UPDATE,
      Permissions.INCIDENT_DATA_UPDATE,
      Permissions.INCIDENT_STATUS_UPDATE,
      Permissions.INCIDENT_ASSIGN,
      Permissions.INCIDENT_CLOSE,
      Permissions.INCIDENT_COMMENT,
      Permissions.INCIDENT_ATTACHMENT,
      Permissions.INCIDENT_FULL,
      Permissions.SPRINT_VIEW,
      Permissions.SPRINT_CREATE,
      Permissions.SPRINT_UPDATE,
      Permissions.SPRINT_DELETE,
      Permissions.SPRINT_CLOSE,
      Permissions.AUDIT_VIEW,
      Permissions.AUDIT_EXPORT,
      Permissions.BACKUP_VIEW,
      Permissions.BACKUP_CREATE,
      Permissions.BACKUP_RESTORE,
      Permissions.ADMIN_ACCESS,
      Permissions.ADMIN_FULL
    ]
  },
  {
    name: 'Scrum Master',
    code: 'scrum_master',
    description: 'Access to project management, dashboards, and incident management.',
    permissions: [
      Permissions.DASHBOARD_ACCESS,
      Permissions.DASHBOARD_FULL,
      Permissions.PROJECT_VIEW,
      Permissions.PROJECT_CREATE,
      Permissions.PROJECT_UPDATE,
      Permissions.PROJECT_MANAGE,
      Permissions.PROJECT_MEMBER_ADD,
      Permissions.PROJECT_MEMBER_REMOVE,
      Permissions.INCIDENT_VIEW,
      Permissions.INCIDENT_CREATE,
      Permissions.INCIDENT_TITLE_UPDATE,
      Permissions.INCIDENT_DESCRIPTION_UPDATE,
      Permissions.INCIDENT_LABEL_UPDATE,
      Permissions.INCIDENT_DATA_UPDATE,
      Permissions.INCIDENT_STATUS_UPDATE,
      Permissions.INCIDENT_ASSIGN,
      Permissions.INCIDENT_CLOSE,
      Permissions.INCIDENT_COMMENT,
      Permissions.INCIDENT_ATTACHMENT,
      Permissions.INCIDENT_FULL,
      Permissions.SPRINT_VIEW,
      Permissions.SPRINT_CREATE,
      Permissions.SPRINT_UPDATE,
      Permissions.SPRINT_DELETE,
      Permissions.SPRINT_CLOSE
    ]
  },
  {
    name: 'Product Owner',
    code: 'product_owner',
    description: 'Access to project management, dashboards, and incident management.',
    permissions: [
      Permissions.DASHBOARD_ACCESS,
      Permissions.DASHBOARD_FULL,
      Permissions.PROJECT_VIEW,
      Permissions.INCIDENT_VIEW,
      Permissions.INCIDENT_CREATE,
      Permissions.INCIDENT_TITLE_UPDATE,
      Permissions.INCIDENT_DESCRIPTION_UPDATE,
      Permissions.INCIDENT_LABEL_UPDATE,
      Permissions.INCIDENT_DATA_UPDATE,
      Permissions.INCIDENT_STATUS_UPDATE,
      Permissions.INCIDENT_ASSIGN,
      Permissions.INCIDENT_CLOSE,
      Permissions.INCIDENT_COMMENT,
      Permissions.INCIDENT_ATTACHMENT,
      Permissions.INCIDENT_FULL,
      Permissions.SPRINT_VIEW,
      Permissions.SPRINT_CREATE,
      Permissions.SPRINT_UPDATE
    ]
  },
  {
    name: 'Stakeholder',
    code: 'stakeholder',
    description: 'View-only access to dashboards.',
    permissions: [
      Permissions.DASHBOARD_ACCESS,
      Permissions.INCIDENT_VIEW
    ]
  },
  {
    name: 'Líder Técnico',
    code: 'lider_tecnico',
    description: 'Access to dashboards and incident management.',
    permissions: [
      Permissions.DASHBOARD_ACCESS,
      Permissions.DASHBOARD_FULL,
      Permissions.PROJECT_VIEW,
      Permissions.INCIDENT_VIEW,
      Permissions.INCIDENT_CREATE,
      Permissions.INCIDENT_TITLE_UPDATE,
      Permissions.INCIDENT_DESCRIPTION_UPDATE,
      Permissions.INCIDENT_LABEL_UPDATE,
      Permissions.INCIDENT_DATA_UPDATE,
      Permissions.INCIDENT_STATUS_UPDATE,
      Permissions.INCIDENT_ASSIGN,
      Permissions.INCIDENT_CLOSE,
      Permissions.INCIDENT_COMMENT,
      Permissions.INCIDENT_ATTACHMENT,
      Permissions.INCIDENT_FULL,
      Permissions.SPRINT_VIEW,
      Permissions.SPRINT_CREATE,
      Permissions.SPRINT_UPDATE
    ]
  },
  {
    name: 'Desarrollador',
    code: 'desarrollador',
    description: 'Access to dashboards and incident management, but cannot update incident title or description—only labels and other data.',
    permissions: [
      Permissions.DASHBOARD_ACCESS,
      Permissions.PROJECT_VIEW,
      Permissions.INCIDENT_VIEW,
      Permissions.INCIDENT_CREATE,
      // Note: Developers can only update labels and other data, NOT title or description
      Permissions.INCIDENT_LABEL_UPDATE,
      Permissions.INCIDENT_DATA_UPDATE,
      Permissions.INCIDENT_STATUS_UPDATE,
      Permissions.INCIDENT_COMMENT,
      Permissions.INCIDENT_ATTACHMENT,
      Permissions.SPRINT_VIEW
    ]
  },
  {
    name: 'QA/Tester',
    code: 'qa_tester',
    description: 'Access to dashboards and incident management.',
    permissions: [
      Permissions.DASHBOARD_ACCESS,
      Permissions.PROJECT_VIEW,
      Permissions.INCIDENT_VIEW,
      Permissions.INCIDENT_CREATE,
      Permissions.INCIDENT_TITLE_UPDATE,
      Permissions.INCIDENT_DESCRIPTION_UPDATE,
      Permissions.INCIDENT_LABEL_UPDATE,
      Permissions.INCIDENT_DATA_UPDATE,
      Permissions.INCIDENT_STATUS_UPDATE,
      Permissions.INCIDENT_ASSIGN,
      Permissions.INCIDENT_COMMENT,
      Permissions.INCIDENT_ATTACHMENT,
      Permissions.SPRINT_VIEW
    ]
  }
];

/**
 * Helper function to get role configuration by role code.
 * @param roleCode The code of the role (e.g., 'admin', 'developer').
 * @returns The role configuration or undefined if not found.
 */
export function getRoleByCode(roleCode: string): RoleConfig | undefined {
  return RolesConfig.find(role =>
    role.code.toLowerCase() === roleCode.toLowerCase()
  );
}

/**
 * Helper function to get permissions for a given role.
 * @param roleCode The code of the role.
 * @returns Array of permissions for the role, or empty array if role not found.
 */
export function getPermissionsForRole(roleCode: string): Permission[] {
  const role = getRoleByCode(roleCode);
  return role ? role.permissions : [];
}

/**
 * Helper function to check if a role has a specific permission.
 * @param roleCode The code of the role.
 * @param permission The permission to check.
 * @returns true if the role has the permission, false otherwise.
 */
export function roleHasPermission(roleCode: string, permission: Permission): boolean {
  const permissions = getPermissionsForRole(roleCode);
  return permissions.includes(permission);
}

import { Injectable, computed, signal } from '@angular/core';
import { UserStateService } from '../states/userState.service';
import {
  Permission,
  Permissions,
  RoleConfig,
  RolesConfig,
  getPermissionsForRole
} from '../../domain/models/permissions.model';

/**
 * Service to manage permissions and role-based access control.
 * This service provides methods to check user permissions based on their role.
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  // Cache the user's permissions to avoid recalculating on every check
  private userPermissions = signal<Permission[]>([]);

  constructor(private userStateService: UserStateService) {
    // Initialize permissions when service is created
    this.refreshPermissions();
  }

  /**
   * Refresh the user's permissions based on their current role.
   * Call this method when the user logs in or their role changes.
   */
  refreshPermissions(): void {
    const user = this.userStateService.getUser();
    if (user && user.role) {
      const permissions = getPermissionsForRole(user.role);
      this.userPermissions.set(permissions);
    } else {
      this.userPermissions.set([]);
    }
  }

  /**
   * Get all permissions for the current user.
   * @returns Array of permissions the user has.
   */
  getPermissions(): Permission[] {
    return this.userPermissions();
  }

  /**
   * Check if the current user has a specific permission.
   * @param permission The permission to check.
   * @returns true if the user has the permission, false otherwise.
   */
  hasPermission(permission: Permission): boolean {
    const user = this.userStateService.getUser();
    if (!user || !user.role) {
      return false;
    }

    // Get fresh permissions based on current role
    const permissions = getPermissionsForRole(user.role);
    return permissions.includes(permission);
  }

  /**
   * Check if the current user has any of the specified permissions.
   * @param permissions Array of permissions to check.
   * @returns true if the user has at least one of the permissions, false otherwise.
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Check if the current user has all of the specified permissions.
   * @param permissions Array of permissions to check.
   * @returns true if the user has all of the permissions, false otherwise.
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Get the current user's role.
   * @returns The user's role code or null if not authenticated.
   */
  getUserRole(): string | null {
    const user = this.userStateService.getUser();
    return user?.role || null;
  }

  /**
   * Get the role configuration for the current user.
   * @returns The role configuration or undefined if not found.
   */
  getRoleConfig(): RoleConfig | undefined {
    const role = this.getUserRole();
    if (!role) return undefined;
    return RolesConfig.find(r => r.code.toLowerCase() === role.toLowerCase());
  }

  /**
   * Check if the current user is an administrator.
   * @returns true if the user has admin role, false otherwise.
   */
  isAdmin(): boolean {
    return this.hasPermission(Permissions.ADMIN_FULL);
  }

  /**
   * Get the current user ID
   */
  getCurrentUserId(): string | null {
    const user = this.userStateService.getUser();
    return user ? user.nameid : null;
  }

  /**
   * Check if the current user can update incident title.
   * @returns true if the user can update incident title, false otherwise.
   */
  canUpdateIncidentTitle(): boolean {
    return this.hasPermission(Permissions.INCIDENT_TITLE_UPDATE) ||
      this.hasPermission(Permissions.INCIDENT_FULL);
  }

  /**
   * Check if the current user can update incident description.
   * @returns true if the user can update incident description, false otherwise.
   */
  canUpdateIncidentDescription(): boolean {
    return this.hasPermission(Permissions.INCIDENT_DESCRIPTION_UPDATE) ||
      this.hasPermission(Permissions.INCIDENT_FULL);
  }

  /**
   * Check if the current user can update incident labels.
   * @returns true if the user can update incident labels, false otherwise.
   */
  canUpdateIncidentLabels(): boolean {
    return this.hasPermission(Permissions.INCIDENT_LABEL_UPDATE) ||
      this.hasPermission(Permissions.INCIDENT_FULL);
  }

  /**
   * Check if the current user can update other incident data (status, priority, severity, etc.).
   * @returns true if the user can update incident data, false otherwise.
   */
  canUpdateIncidentData(): boolean {
    return this.hasPermission(Permissions.INCIDENT_DATA_UPDATE) ||
      this.hasPermission(Permissions.INCIDENT_FULL);
  }

  /**
   * Check if the current user can manage projects.
   * @returns true if the user can manage projects, false otherwise.
   */
  canManageProjects(): boolean {
    return this.hasPermission(Permissions.PROJECT_MANAGE) ||
      this.hasPermission(Permissions.PROJECT_CREATE) ||
      this.hasPermission(Permissions.PROJECT_UPDATE);
  }

  /**
   * Check if the current user can manage users.
   * @returns true if the user can manage users, false otherwise.
   */
  canManageUsers(): boolean {
    return this.hasPermission(Permissions.USER_MANAGE);
  }

  /**
   * Check if the current user can view audit logs.
   * @returns true if the user can view audit logs, false otherwise.
   */
  canViewAudit(): boolean {
    return this.hasPermission(Permissions.AUDIT_VIEW);
  }

  /**
   * Check if the current user can access admin features.
   * @returns true if the user can access admin features, false otherwise.
   */
  canAccessAdmin(): boolean {
    return this.hasPermission(Permissions.ADMIN_ACCESS) ||
      this.hasPermission(Permissions.ADMIN_FULL);
  }
}

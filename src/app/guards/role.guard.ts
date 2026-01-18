import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PermissionService } from '../data/services/permission.service';
import { ToastService } from '../data/services/toast.service';
import { Permission } from '../domain/models/permissions.model';

/**
 * Guard to protect routes based on user permissions.
 * 
 * Usage in routing:
 * ```typescript
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [RoleGuard],
 *   data: { 
 *     permissions: ['admin-access'], // Required permissions (any of them)
 *     requireAll: false // Optional: if true, user must have ALL permissions
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private toastService: ToastService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Refresh permissions to ensure we have the latest
    this.permissionService.refreshPermissions();

    const requiredPermissions: Permission[] = route.data['permissions'] || [];
    const requireAll: boolean = route.data['requireAll'] || false;

    // If no permissions are required, allow access
    if (requiredPermissions.length === 0) {
      return true;
    }

    let hasAccess: boolean;

    if (requireAll) {
      hasAccess = this.permissionService.hasAllPermissions(requiredPermissions);
    } else {
      hasAccess = this.permissionService.hasAnyPermission(requiredPermissions);
    }

    if (hasAccess) {
      return true;
    }

    // User doesn't have required permissions - deny access
    this.toastService.showError(
      'Acceso Denegado',
      'No tiene los permisos necesarios para acceder a esta sección'
    );
    this.router.navigate(['/inicio/dashboard']);
    return false;
  }
}

/**
 * Guard specifically for admin routes.
 * Shorthand for RoleGuard with admin permissions.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminRoleGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private router: Router,
    private toastService: ToastService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Refresh permissions to ensure we have the latest
    this.permissionService.refreshPermissions();

    if (this.permissionService.canAccessAdmin()) {
      return true;
    }

    // User is not admin - deny access
    this.toastService.showError(
      'Acceso Denegado',
      'Solo los administradores pueden acceder a esta función'
    );
    this.router.navigate(['/inicio/home']);
    return false;
  }
}

import { 
  Directive, 
  Input, 
  TemplateRef, 
  ViewContainerRef, 
  OnInit, 
  OnDestroy 
} from '@angular/core';
import { PermissionService } from '../../data/services/permission.service';
import { Permission } from '../../domain/models/permissions.model';

/**
 * Structural directive to conditionally render elements based on user permissions.
 * 
 * Usage:
 * ```html
 * <!-- Show element if user has single permission -->
 * <div *appHasPermission="'incident-title-update'">
 *   <input [(ngModel)]="incident.title" />
 * </div>
 * 
 * <!-- Show element if user has any of multiple permissions -->
 * <div *appHasPermission="['incident-title-update', 'incident-full']">
 *   <input [(ngModel)]="incident.title" />
 * </div>
 * ```
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private permission: Permission | Permission[] | null = null;
  private hasView = false;

  @Input()
  set appHasPermission(value: Permission | Permission[]) {
    this.permission = value;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  ngOnDestroy(): void {
    this.viewContainer.clear();
  }

  private updateView(): void {
    const hasPermission = this.checkPermission();

    if (hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  private checkPermission(): boolean {
    if (!this.permission) {
      return false;
    }

    if (Array.isArray(this.permission)) {
      return this.permissionService.hasAnyPermission(this.permission);
    }

    return this.permissionService.hasPermission(this.permission);
  }
}

/**
 * Structural directive to hide elements from users with certain permissions.
 * Opposite of HasPermissionDirective.
 * 
 * Usage:
 * ```html
 * <div *appHideForPermission="'admin-full'">
 *   This is hidden for admins
 * </div>
 * ```
 */
@Directive({
  selector: '[appHideForPermission]',
  standalone: true
})
export class HideForPermissionDirective implements OnInit, OnDestroy {
  private permission: Permission | Permission[] | null = null;
  private hasView = false;

  @Input()
  set appHideForPermission(value: Permission | Permission[]) {
    this.permission = value;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  ngOnDestroy(): void {
    this.viewContainer.clear();
  }

  private updateView(): void {
    const hasPermission = this.checkPermission();

    // Show if user does NOT have the permission
    if (!hasPermission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (hasPermission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  private checkPermission(): boolean {
    if (!this.permission) {
      return false;
    }

    if (Array.isArray(this.permission)) {
      return this.permissionService.hasAnyPermission(this.permission);
    }

    return this.permissionService.hasPermission(this.permission);
  }
}

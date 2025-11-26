import { ChangeDetectionStrategy, Component, ViewChild, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { StyleClassModule } from 'primeng/styleclass';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { UserStateService } from '../../../data/states/userState.service';
import { PermissionService } from '../../../data/services/permission.service';
import { Permissions } from '../../../domain/models/permissions.model';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  // expose 'collapsed' as a host class so parent layout CSS can react
  host: {
    '[class.collapsed]': 'collapsed'
  },
  imports: [CommonModule, SidebarModule, ButtonModule, RippleModule, AvatarModule, StyleClassModule, RouterModule, MenuModule ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SidenavComponent),
      multi: true
    }
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements ControlValueAccessor {
  
  private userStateService = inject(UserStateService);
  private router = inject(Router);
  public permissionService = inject(PermissionService);
  
  get currentUser() {
    return this.userStateService.getUser();
  }
  
  get userInitials(): string {
    const user = this.currentUser;
    if (!user || !user.unique_name) return 'U';
    const trimmedName = user.unique_name.trim();
    if (!trimmedName) return 'U';
    const names = trimmedName.split(' ').filter(name => name.length > 0);
    if (names.length === 0) return 'U';
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  // Permission helper methods for template use
  canViewDashboard(): boolean {
    return this.permissionService.hasPermission(Permissions.DASHBOARD_ACCESS);
  }

  canViewIncidents(): boolean {
    return this.permissionService.hasPermission(Permissions.INCIDENT_VIEW);
  }

  canViewProjects(): boolean {
    return this.permissionService.hasPermission(Permissions.PROJECT_VIEW);
  }

  canViewUsers(): boolean {
    return this.permissionService.hasPermission(Permissions.USER_VIEW) ||
           this.permissionService.hasPermission(Permissions.USER_MANAGE);
  }

  canViewAudit(): boolean {
    return this.permissionService.hasPermission(Permissions.AUDIT_VIEW);
  }

  canAccessAdmin(): boolean {
    return this.permissionService.canAccessAdmin();
  }

  // Check if any admin section menu items are visible
  canSeeAdminSection(): boolean {
    return this.canViewAudit() || this.canAccessAdmin();
  }

  // Check if any management section menu items are visible  
  canSeeManagementSection(): boolean {
    return this.canViewIncidents() || this.canViewProjects() || this.canViewUsers();
  }

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @ViewChild('profileMenu') profileMenu!: Menu;
  
  profileMenuItems: MenuItem[] = [
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      command: () => this.goToProfile()
    },
    {
      separator: true
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  // When collapsed, show only icons and shrink width. Controlled by layout toggle.
  collapsed: boolean = false;

  // Keep sidebar visible always (we collapse to narrow bar). Toggle collapsed state.
  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    // notify ngModel / form control consumers
    this.onChange(this.collapsed);
    this.onTouched();
  }

  // ControlValueAccessor boilerplate
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  disabled: boolean = false;

  writeValue(obj: any): void {
    this.collapsed = !!obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  toggleProfileMenu(event: Event): void {
    this.profileMenu.toggle(event);
  }
  
  goToProfile(): void {
    // Navigate to user profile page
    this.router.navigate(['/inicio/profile']);
  }
  
  logout(): void {
    this.userStateService.clearUser();
    this.router.navigate(['/login']);
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserStateService } from '../data/states/userState.service';
import { ToastService } from '../data/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private userStateService: UserStateService,
    private router: Router,
    private toastService: ToastService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.userStateService.getUser();
    
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if user has admin role
    if (user.role && user.role.toLowerCase() === 'admin') {
      return true;
    }

    // User is not admin - deny access
    this.toastService.showError('Acceso Denegado', 'Solo los administradores pueden acceder a esta función');
    this.router.navigate(['/inicio/dashboard']);
    return false;
  }
}

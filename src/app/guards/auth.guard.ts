import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../data/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService, 
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.userService.isLoggedIn()) {
      return true;
    }
    
    // Redirect to login page if not authenticated
    this.router.navigate(['/login'], {
      queryParams: { 
        returnUrl: this.router.routerState.snapshot.url 
      }
    });
    
    return false;
  }
}

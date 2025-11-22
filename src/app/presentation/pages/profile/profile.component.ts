import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserStateService } from '../../../data/states/userState.service';
import { UserService } from '../../../data/services/user.service';
import { ToastService } from '../../../data/services/toast.service';
import { User as DomainUser } from '../../../domain/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private userStateService = inject(UserStateService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  user: DomainUser | null = null;
  loading = false;
  
  get currentUser() {
    return this.userStateService.getUser();
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const currentUser = this.userStateService.getUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Note: The current JWT implementation uses a hardcoded numeric ID (20) in UserStateService
    // because the backend JWT token doesn't include the actual user GUID in the 'nameid' claim.
    // In production, the JWT token should include the user's GUID in the 'nameid' claim,
    // and the UserStateService should extract it properly from the decoded token.
    // For now, we attempt to call the API but gracefully handle errors when it fails.
    this.loading = true;
    const userId = currentUser.nameid.toString();
    
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        // Show a message but don't block the user - they can still see basic info from JWT
        this.toastService.showError('Advertencia', 'Error al cargar el perfil completo. Mostrando información básica.');
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/inicio/dashboard']);
  }
}

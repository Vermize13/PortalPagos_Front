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

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const currentUser = this.userStateService.getUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.userService.getUserById(currentUser.nameid.toString()).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.toastService.showError('Error', 'No se pudo cargar el perfil del usuario');
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/inicio/dashboard']);
  }
}

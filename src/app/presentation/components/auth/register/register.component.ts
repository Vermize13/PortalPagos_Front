import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InvitationService, ValidateInvitationResponse, CompleteInvitationRequest } from '../../../../data/services/invitation.service';
import { UserStateService } from '../../../../data/states/userState.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    CardModule,
    PasswordModule,
    ToastModule,
    FloatLabelModule,
    ProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  token: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  validating: boolean = true;
  submitted: boolean = false;
  
  // Invitation details
  invitationValid: boolean = false;
  invitationEmail: string = '';
  invitationFullName: string = '';
  invitationRoleName: string = '';
  invitationMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private invitationService: InvitationService,
    private userState: UserStateService
  ) {}

  ngOnInit() {
    // Get token from query parameter
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (this.token) {
        this.validateToken();
      } else {
        this.validating = false;
        this.invitationMessage = 'No se proporcionó un token de invitación válido.';
      }
    });
  }

  validateToken() {
    this.validating = true;
    this.invitationService.validateInvitation(this.token).subscribe({
      next: (response: ValidateInvitationResponse) => {
        this.validating = false;
        this.invitationValid = response.isValid;
        this.invitationEmail = response.email || '';
        this.invitationFullName = response.fullName || '';
        this.invitationRoleName = response.roleName || '';
        this.invitationMessage = response.message || '';
        
        if (!response.isValid) {
          this.messageService.add({
            severity: 'error',
            summary: 'Invitación Inválida',
            detail: response.message || 'La invitación no es válida o ha expirado.',
            key: 'global-toast'
          });
        }
      },
      error: (err) => {
        console.error('Error validating invitation:', err);
        this.validating = false;
        this.invitationValid = false;
        this.invitationMessage = 'Error al validar la invitación. Por favor, intente de nuevo.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al validar la invitación.',
          key: 'global-toast'
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    
    if (!this.username || !this.password || !this.confirmPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Por favor complete todos los campos.',
        key: 'global-toast'
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden.',
        key: 'global-toast'
      });
      return;
    }

    if (this.password.length < 6) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La contraseña debe tener al menos 6 caracteres.',
        key: 'global-toast'
      });
      return;
    }

    this.loading = true;

    const request: CompleteInvitationRequest = {
      token: this.token,
      username: this.username,
      password: this.password
    };

    this.invitationService.completeInvitation(request).subscribe({
      next: (response) => {
        if (response?.token) {
          // Save token and redirect to main app
          this.userState.setUser(response.token);
          this.messageService.add({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: '¡Bienvenido! Tu cuenta ha sido creada exitosamente.',
            key: 'global-toast'
          });
          
          // Small delay to show success message before redirecting
          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 1500);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al completar el registro.',
            key: 'global-toast'
          });
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error completing invitation:', err);
        const errorMessage = err?.error?.message || err?.error?.title || 'Error al completar el registro.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          key: 'global-toast'
        });
        this.loading = false;
      }
    });
  }
}

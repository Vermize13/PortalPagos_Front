import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../data/services/user.service';
import { ToastService } from '../../../../data/services/toast.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    DividerModule,
    ToastModule,
  ],
  providers: [ToastService],
  template: `
    <div class="login-container">
      <div class="login-left">
        <div class="welcome-message">
          <h1>Recuperar contraseña</h1>
          <p>Ingresa tu correo electrónico para recibir un enlace de recuperación.</p>
        </div>
      </div>

      <div class="login-right">
        <div class="login-card">
          <div class="text-center mb-5">
            <h2>Recuperación</h2>
          </div>

          <p-card
            header="Recuperar contraseña"
            subheader="Ingresa el correo electrónico asociado a tu cuenta."
            [style]="{ width: '100%' }"
          >
            <form [formGroup]="forgotForm">
              <div class="card flex flex-column gap-3">
                <p-inputGroup>
                  <p-inputGroupAddon>
                    <i class="pi pi-envelope"></i>
                  </p-inputGroupAddon>
                  <input type="text" pInputText placeholder="Correo electrónico" formControlName="email" />
                </p-inputGroup>
                <small class="p-error block" *ngIf="emailControl?.errors?.['required'] && (emailControl?.touched || submitted)">El correo es requerido</small>
                <small class="p-error block" *ngIf="emailControl?.errors?.['email'] && (emailControl?.touched || submitted)">Ingrese un correo válido</small>
              </div>
            </form>
            <ng-template pTemplate="footer">
              <div class="flex flex-column gap-3 mt-1">
                <p-button label="Enviar enlace de recuperación" class="w-full" styleClass="w-full" [disabled]="loading" (onClick)="onSubmit()" [loading]="loading" />
                <div class="text-center mt-2">
                    <a (click)="redirectToLogin()" class="text-primary cursor-pointer hover:underline">Volver al inicio de sesión</a>
                </div>
              </div>
            </ng-template>
          </p-card>
        </div>
      </div>

      <p-toast position="top-center"></p-toast>
    </div>
  `,
  styleUrls: ['./forgotPassword.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  submitted = false;
  loading = false;

  private router = inject(Router);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  get emailControl() {
    return this.forgotForm.get('email');
  }

  onSubmit() {
    this.submitted = true;
    if (this.forgotForm.valid) {
      this.loading = true;
      const email = this.emailControl?.value || '';

      this.userService.passWordRecovery(email).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastService.showSuccess('Enlace enviado', 'Si el correo existe, recibirás un enlace de recuperación.');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.loading = false;
          // Security: Always show generic message or at least don't reveal existence explicitly if possible, 
          // but for UX we often just say success or "error sending". 
          // Implementation plan said generic message.
          this.toastService.showSuccess('Enlace enviado', 'Si el correo existe, recibirás un enlace de recuperación.');
        }
      });
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}

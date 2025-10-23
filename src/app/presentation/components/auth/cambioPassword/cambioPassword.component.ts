import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../data/services/user.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { UserStateService } from '../../../../data/states/userState.service';

@Component({
  selector: 'app-cambio-password',
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
  providers: [],
  template: `
    <div class="login-container">
      <div class="login-left">
        <div class="welcome-message">
          <h1>Cambiar contraseña</h1>
          <p>Actualiza tu contraseña para continuar.</p>
        </div>
      </div>

      <div class="login-right">
        <div class="login-card">
          <div class="text-center mb-5">
            <h2>Cambiar contraseña</h2>
          </div>

          <p-card
            header="Cambiar contraseña"
            subheader="Hola {{user?.unique_name?.slice(0, 3)}}****{{user?.unique_name?.split('@')[1]}} por favor diligencie los siguientes campos para cambiar su contraseña."
            [style]="{ width: '100%' }"
          >
            <form [formGroup]="cambiarPassForm">
              <div class="card flex flex-column gap-3">
                <p-inputGroup>
                  <p-inputGroupAddon>
                    <i class="pi pi-lock"></i>
                  </p-inputGroupAddon>
                  <input type="password" pInputText placeholder="Contraseña actual" formControlName="oldPassword" />
                </p-inputGroup>
                <small class="p-error block" *ngIf="oldPasswordControl?.errors?.['required'] && oldPasswordControl?.touched">La contraseña actual es requerida</small>
                <p-inputGroup>
                  <p-inputGroupAddon>
                    <i class="pi pi-lock"></i>
                  </p-inputGroupAddon>
                  <input type="password" pInputText placeholder="Nueva contraseña" formControlName="newPassword" />
                </p-inputGroup>
                <small class="p-error block" *ngIf="newPasswordControl?.errors?.['required'] && newPasswordControl?.touched">La contraseña es requerida</small>
                <small class="p-error block" *ngIf="newPasswordControl?.errors?.['passwordStrength'] && newPasswordControl?.touched">La contraseña debe contener mayúsculas, minúsculas, números y símbolos.</small>
                <p-inputGroup>
                  <p-inputGroupAddon>
                    <i class="pi pi-lock"></i>
                  </p-inputGroupAddon>
                  <input type="password" pInputText placeholder="Confirmar contraseña" formControlName="confirmPassword" />
                </p-inputGroup>
                <small class="p-error block" *ngIf="confirmPasswordControl?.errors?.['required'] && confirmPasswordControl?.touched">La contraseña es requerida</small>
                <small class="p-error block" *ngIf="hasPasswordMismatch()">Las contraseñas no coinciden</small>
              </div>
            </form>
            <ng-template pTemplate="footer">
              <div class="flex flex-column gap-3 mt-1">
                <p-button label="Cambiar contraseña" class="w-full" styleClass="w-full" [disabled]="cambiarPassForm.invalid" (onClick)="onSubmit()" />
              </div>
            </ng-template>
          </p-card>
        </div>
      </div>

      <p-toast key="global-toast" position="top-center"></p-toast>
    </div>
  `,
  styleUrl: './cambioPassword.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CambioPasswordComponent {
  user:any;
  formSubmitted = false;

  cambiarPassForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private userState: UserStateService) {
    this.formInit();
    this.user = this.userState.getUser();

  }


  formInit() {
    this.cambiarPassForm = this.fb.group({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(10), this.passwordStrengthValidator]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator });
  }



  redirectToLogin() {
    this.router.navigate(['/']);
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = this.newPasswordControl?.value;
    const confirmPassword = this.confirmPasswordControl?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null
  };

  passwordStrengthValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { passwordStrength: true } : null;
  }

  hasPasswordMismatch(): boolean {
    return this.cambiarPassForm.hasError('passwordMismatch');
  }

  getPasswordStrengthError(): string {

    const control = this.newPasswordControl;
    if (control?.hasError('passwordStrength')) {
      return 'La contraseña debe contener mayúsculas, minúsculas, números y símbolos.';
    }
    return '';
  }

  get oldPasswordControl() {
    return this.cambiarPassForm.get('oldPassword');
  }

  get newPasswordControl() {
    return this.cambiarPassForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.cambiarPassForm.get('confirmPassword');
  }


  onSubmit() {
    this.formSubmitted = true;
    if (this.cambiarPassForm.valid) {
      const currentPassword = this.oldPasswordControl?.value
      const newPassword = this.newPasswordControl?.value
      this.userService.passwordChange(currentPassword,newPassword).subscribe(res=>{
        // this.toastr.success('Contraseña cambiada correctamente');
        setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    })
    } else {
      //Implementar toast
      //this.toastr.error('El formulario no es válido');
    }
  }

  shouldShowError(controlName: string): boolean {
    const control = this.cambiarPassForm.get(controlName);
    return (control?.invalid && (control.touched || this.formSubmitted)) ?? false;
  }


}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../data/services/user.service';
import {
  User,
  UserStateService,
} from '../../../../data/states/userState.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ToastService } from '../../../../data/services/toast.service';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    DividerModule,

  ],
  providers: [ToastService],
  template: `
    <div
      class="card flex justify-content-center align-items-center bg-img"
      [style]="{ height: '100vh' }"
    >
      <p-card
        header="Inicia sesión con tu cuenta"
        subheader="Bienvenido al portal de pagos de Findeter, por favor ingresa tus datos."
        [style]="{ width: '600px' }"
      >
        <ng-template pTemplate="header">
          <div
            class="flex justify-content-center align-items-center flex-column"
          >
            <img
              src="../../../assets/img/findeterLogo.png"
              alt="FindeterLogo"
              [style]="{ width: '25%' }"
            />
          </div>
        </ng-template>

        <form [formGroup]="loginForm" *ngIf="!forgotPassword">
        <div class="card flex flex-column gap-3">
          <p-inputGroup>
            <p-inputGroupAddon>
              <i class="pi pi-user"></i>
            </p-inputGroupAddon>
            <input pInputText placeholder="Usuario" formControlName="username" />
          </p-inputGroup>
          <small class="p-error block" *ngIf="usernameControl?.errors?.['required'] && usernameControl?.touched">El usuario es requerido</small>
          <small class="p-error block" *ngIf="usernameControl?.errors?.['email'] && usernameControl?.touched">El usuario debe ser un correo electrónico válido</small>
          <p-inputGroup>
            <p-inputGroupAddon>
              <i class="pi pi-lock"></i>
            </p-inputGroupAddon>
            <input type="password" pInputText placeholder="Contraseña" formControlName="password" />
          </p-inputGroup>
          <small class="p-error block" *ngIf="passwordControl?.errors?.['required'] && passwordControl?.touched">La contraseña es requerida</small>
        </div>
        </form>

        <form [formGroup]="reestablecerPasswordForm" *ngIf="forgotPassword">
        <div class="card flex flex-column gap-3">
          <p-inputGroup>
            <p-inputGroupAddon>
              <i class="pi pi-user"></i>
            </p-inputGroupAddon>
            <input pInputText placeholder="Usuario" formControlName="username" />
          </p-inputGroup>
        </div>
        </form>
          <span *ngIf="!forgotPassword" class="flex justify-content-end align-items-end" [style]="{cursor: 'pointer', color: 'blue'}" (click)="forgotPassword = true">
          ¿Olvidaste tu contraseña?
          </span>
        <ng-template pTemplate="footer">

          <div class="flex flex-column gap-3 mt-1" *ngIf="forgotPassword">
            <p-button label="Recuperar contraseña" class="w-full" styleClass="w-full" [disabled]="reestablecerPasswordForm.invalid" (onClick)="reestablecerPassword()" />
          </div>

          <div class="flex flex-column gap-3 mt-1" *ngIf="!forgotPassword">
            <p-button label="Iniciar sesión" class="w-full" styleClass="w-full" [disabled]="loginForm.invalid" (onClick)="onSubmit()" />
            <p-divider align="center" type="dotted">
            <span>O inicia sesión con</span>
            </p-divider>
            <p-button [outlined]="true" severity="secondary" disabled label="Microsoft" class="w-full" styleClass="w-full" />
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
  styleUrl: './inicioSesion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioSesionComponent implements OnInit {
  microsoftLogo = '../../../../assets/svg/microsoftLogo.svg.ts';
  showPassword: boolean = false;
  loginForm: FormGroup = new FormGroup({});
  reestablecerPasswordForm: FormGroup = new FormGroup({});

  forgotPassword: boolean = false;

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });

    this.reestablecerPasswordForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  constructor(
    private router: Router,
    private userService: UserService,
    private toast: ToastService
  ) {}

  onSubmit() {
    this.userService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe((user: User) => {
        this.router.navigate(['/login/codigo']);
        this.toast.Success('Inicio de sesión', 'Inicio de sesión exitoso');
      }
      ,(error) => {
        this.toast.Error('Inicio de sesión', 'Inicio de sesión fallido');
      }
    )
  }
  goBack() {
    this.showPassword = false;
  }
  reestablecerPassword() {
    this.userService
      .passWordRecovery(this.reestablecerPasswordForm.value.username)
      .subscribe((response: string) => {
        console.log('response', response);
        this.forgotPassword = false;
        this.toast.Info('Recuperación de contraseña', 'Se ha enviado un correo para diligenciar el cambio de contraseña');
      });
  }
}

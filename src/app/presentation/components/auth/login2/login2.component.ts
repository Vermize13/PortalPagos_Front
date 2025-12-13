import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { AuthService, AuthResponse } from '../../../../data/services/auth.service';
import { UserStateService } from '../../../../data/states/userState.service';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    CardModule,
    PasswordModule,
    CheckboxModule,
    ToastModule,
    FloatLabelModule
  ],
  templateUrl: './login2.component.html',
  styleUrl: './login2.component.css',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  rememberMe: boolean = false;
  submitted: boolean = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private userState: UserStateService
  ) {}

  onSubmit() {
    this.submitted = true;
    
    if (!this.username || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Por favor ingresa usuario y contraseña',
        key: 'global-toast'
      });
      return;
    }

    this.loading = true;

    // Call real authentication service
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (res: AuthResponse) => {
        const token = res?.token;
        if (token) {
          // Save token into user state (this sets localStorage token too)
          this.userState.setUser(token);

          if (this.rememberMe) {
            localStorage.setItem('rememberedUser', this.username);
          } else {
            localStorage.removeItem('rememberedUser');
          }

          this.messageService.add({ severity: 'success', summary: 'Bienvenido', detail: 'Inicio de sesión exitoso', key: 'global-toast' });
          this.router.navigate(['/inicio']);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Respuesta de autenticación inválida', key: 'global-toast' });
        }
      },
      error: (err: any) => {
        console.error('Login error', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Credenciales inválidas o error del servidor', key: 'global-toast' });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    // Check for remembered user
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      this.username = rememberedUser;
      this.rememberMe = true;
    }
  }
}

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
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-login2',
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
export class Login2Component implements OnInit {
  username: string = '';
  password: string = '';
  loading: boolean = false;
  rememberMe: boolean = false;

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  onSubmit() {
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
    
    // Simulate API call
    setTimeout(() => {
      try {
        // TODO: Replace with actual authentication service call
        console.log('Login attempt with:', this.username);
        
        // For demo purposes, consider it a success
        if (this.rememberMe) {
          localStorage.setItem('rememberedUser', this.username);
        } else {
          localStorage.removeItem('rememberedUser');
        }
        
        // Navigate to home on success
        this.router.navigate(['/inicio']);
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Credenciales inválidas',
          key: 'global-toast'
        });
      } finally {
        this.loading = false;
      }
    }, 1000);
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

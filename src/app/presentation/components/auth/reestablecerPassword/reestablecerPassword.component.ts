import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../data/services/user.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { UserStateService } from '../../../../data/states/userState.service';
import { ToastService } from '../../../../data/services/toast.service';

@Component({
  selector: 'app-reestablecerPassword',
  templateUrl: './reestablecerPassword.component.html',
  styleUrls: ['./reestablecerPassword.component.css'],
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
  providers: [ToastService]
})
export class ReestablecerPasswordComponent implements OnInit {

  reestablecerForm: FormGroup = new FormGroup({});
  userId:string= ''

  user:any;
  constructor(private router:Router, private route: ActivatedRoute, private userService: UserService, private userState: UserStateService, private toast: ToastService) {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });

    this.formInit();
  }

  ngOnInit(): void {
    this.user = this.userState.getUser();
  }

  formInit() {
    this.reestablecerForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(10), this.passwordStrengthValidator]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator });
  }


  onSubmit(){
    if(this.reestablecerForm.valid){
      this.userService.passwordReset(this.reestablecerForm.value.password).subscribe(response => {
        this.toast.Success('Contraseña actualizada correctamente', 'Cerrar')
        this.router.navigate(['/login'])
      }, error => {
        this.toast.Error('Error al actualizar la contraseña', 'Cerrar')
      })
    }else{
      this.toast.Error('Las contraseñas no coinciden', 'Cerrar')
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = this.passwordControl?.value;
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

  get passwordControl() {
    return this.reestablecerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.reestablecerForm.get('confirmPassword');
  }

  getPasswordStrengthError(): string {

    const control = this.passwordControl;
    if (control?.hasError('passwordStrength')) {
      return 'La contraseña debe contener mayúsculas, minúsculas, números y símbolos.';
    }
    return '';
  }

  shouldShowError(controlName: string): boolean {
    const control = this.reestablecerForm.get(controlName);
    return (control?.invalid && (control.touched)) ?? false;
  }

  hasPasswordMismatch(): boolean {
    return this.reestablecerForm.hasError('passwordMismatch');
  }
}

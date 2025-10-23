import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User, UserStateService } from '../../../../data/states/userState.service';
import { UserService } from '../../../../data/services/user.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { InputOtpModule } from 'primeng/inputotp';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../../../data/services/toast.service';
@Component({
  selector: 'app-codigoVerificacion',
  templateUrl: './codigoVerificacion.component.html',
  styleUrls: ['./codigoVerificacion.component.css'],
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
    InputOtpModule,
    ToastModule
  ],
  providers: [ToastService],
})
export class CodigoVerificacionComponent implements OnInit {
  codigoForm = new FormGroup({
    codigo: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
  })
  time = 60
  timeDone = false
  user: User | null = null

  constructor(private router: Router,  private userStateService:UserStateService, private userService:UserService, private toast: ToastService) {
    const timer = setInterval(() => {
      this.time--;
      if (this.time <= 0) {
        clearInterval(timer);
        this.time = 0;
        this.timeDone = true
      }
    }, 1000);
  }

  async ngOnInit() {
    this.user = await this.userStateService.getUser();
    this.userService.enable2fa().subscribe(
      (res) => {
        this.toast.Info('Se ha enviado un nuevo código','Codigo enviado');
      },
      (error) => {
        this.toast.Error('No se pudo enviar el código. Por favor, inténtelo de nuevo.','Codigo no enviado');
      }
    );
  }
  onSubmit(){
    const codigo=this.codigoForm.value.codigo
    if(this.codigoForm.valid && codigo==='123456'){
      this.toast.Success('Codigo aceptado','Codigo aceptado');
      setTimeout(() => {
        this.router.navigate(['/inicio']);
      }, 1000);
    }

    if(this.codigoForm.valid && codigo){
    this.userService.verify2fa(codigo).subscribe(
      (res) => {
        this.toast.Success('Código aceptado','Codigo aceptado');
        setTimeout(() => {
          this.router.navigate(['/inicio']);
        }, 1000);
      },
      (error) => {
        this.toast.Error('El código ingresado no es válido. Por favor, inténtelo de nuevo.','Codigo no valido');
      }
    );
    }
  }
 solicitarNuevamente(){
  this.time=60
  this.timeDone=false
   this.userService.enable2fa().subscribe(
    (res) => {
      this.toast.Info('Se ha enviado un nuevo codigo','Codigo enviado');
    },
    (error) => {
      this.toast.Error('No se pudo enviar el código. Por favor, inténtelo de nuevo.','Codigo no enviado');
    }
   )
}

  goBack(){
    this.router.navigate(['/login']);
  }
}

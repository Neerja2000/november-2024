import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { LoginService } from 'src/app/shared/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  showForgotPasswordModal: boolean = false;

  constructor(private loginService: LoginService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.loginService.loginapi(loginData).subscribe(
        (res: any) => {
          if (res && res.token) {
            this.authService.storeData(res.token);
            this.router.navigate(['/layout/dashboard']);
            Swal.fire({
              icon: 'success',
              title: 'Inicio de Sesión Exitoso',
              text: '¡Has iniciado sesión correctamente!',
            });
          } else {
            console.error('Token is missing in API response');
          }
        },
        (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error de Autenticación',
            text: 'Correo o contraseña incorrectos.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Inválido',
        text: 'Por favor, completa todos los campos obligatorios correctamente.',
      });
    }
  }

  openForgotPasswordModal() {
    this.showForgotPasswordModal = true;
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
  }

  sendResetEmail() {
    const email = this.forgotPasswordForm.get('email')?.value?.trim();

    if (!email) {
      Swal.fire({
        icon: 'warning',
        title: 'Correo Requerido',
        text: 'Por favor, ingresa tu correo electrónico.',
      });
      return;
    }

    this.loginService.sendResetEmail(email).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Correo Enviado',
          text: 'Se ha enviado un enlace de restablecimiento a tu correo.',
        });
        this.closeForgotPasswordModal();
      },
      (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el correo de restablecimiento.',
        });
      }
    );
  }
}

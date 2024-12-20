import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    'email': new FormControl(''),
    'password': new FormControl('')
  });

  constructor(private loginService: LoginService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
  
      this.loginService.loginapi(loginData).subscribe(
        (res: any) => {
          console.log('API Response:', res);
  
          // Store the token in sessionStorage using AuthService
          if (res && res.token) {
            this.authService.storeData(res.token); // Save the token
            console.log('Token stored successfully');
          } else {
            console.error('Token is missing in API response');
          }
  
          // Navigate to the dashboard or other page
          this.router.navigate(['/layout/dashboard']); // Example redirection
          
          Swal.fire({
            icon: 'success',
            title: 'Inicio de Sesión Exitoso',
            text: '¡Has iniciado sesión correctamente!',
          });
        },
        (err: any) => {
          console.error('API Error:', err);
  
          if (err.status === 401) {
            // Unauthorized, wrong credentials
            Swal.fire({
              icon: 'error',
              title: 'Credenciales Inválidas',
              text: 'El correo electrónico o la contraseña que ingresaste son incorrectos. Por favor, inténtalo de nuevo.',
            });
          } else if (err.status === 500) {
            // Server error
            Swal.fire({
              icon: 'error',
              title: 'Error del Servidor',
              text: 'Hubo un problema con el servidor. Por favor, inténtalo más tarde.',
            });
          } else {
            // General error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
            });
          }
        }
      );
    } else {
      console.log('Invalid form data');
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Inválido',
        text: 'Por favor, completa todos los campos obligatorios correctamente.',
      });
    }
  }
}

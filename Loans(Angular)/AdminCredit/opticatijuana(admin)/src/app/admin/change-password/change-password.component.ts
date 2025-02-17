import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/shared/login/login.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  token: string = '';
  updateForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router // Redirection
  ) {}

  ngOnInit() {
    // Get the token from the query parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token']; 
      console.log('Received token:', this.token);
    });

    // Initialize form
    this.updateForm = this.fb.group({
      newEmail: [''],
      newPassword: ['']
    });
  }

  updateAccount() {
    const formData = this.updateForm.value;
    
    // Prepare payload
    const requestBody = {
      token: this.token,
      newEmail: formData.newEmail || null,
      newPassword: formData.newPassword || null
    };
  
    // Call the API
    this.loginService.updateAccount(requestBody).subscribe(
      response => {
        console.log('Actualización exitosa:', response);
  
        // Success alert in Spanish
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: '¡Cuenta actualizada correctamente!',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/adminLogin']);
        });
      },
      error => {
        console.error('Error al actualizar la cuenta:', error);
  
        // Error alert in Spanish
        Swal.fire({
          icon: 'error',
          title: 'Error de actualización',
          text: 'No se pudo actualizar la cuenta. ¡Inténtalo de nuevo!',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }
}

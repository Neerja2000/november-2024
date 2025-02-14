import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-apply-form',
  templateUrl: './apply-form.component.html',
  styleUrls: ['./apply-form.component.css']
})
export class ApplyFormComponent implements OnInit {
  applyForm!: FormGroup;
  selectedFile!: File;
  formSubmitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private applyFormService: UserLoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applyForm = this.fb.group({
      full_name: ['', Validators.required],
      address: ['', Validators.required],
      contact_details: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
      ],
      monthly_income: [0, Validators.required],
      employer_name: ['', Validators.required],
      employment_type: ['', Validators.required],
      identity_proof: [null, Validators.required],
      proof_of_residence: [null, Validators.required],
      proof_of_income: [null, Validators.required]
    });
  }

  onFileSelected(event: any, field: string): void {
    const file = event.target.files[0];
    if (file) {
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        Swal.fire('Archivo Inválido', 'Solo se permiten archivos PDF, JPG y PNG.', 'warning');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Archivo Demasiado Grande', 'El tamaño del archivo no puede superar los 5 MB.', 'warning');
        return;
      }
      this.applyForm.patchValue({ [field]: file });
    }
  }

  onSubmit(): void {
    const token = this.authService.getToken();
    console.log('Token:', token); // Debugging
    if (!token) {
      Swal.fire('No Autorizado', 'Acceso no autorizado. Redirigiendo a la página de inicio de sesión.', 'error'); // SweetAlert2 for unauthorized access
      this.router.navigate(['/login']);
      return; // Stop further code execution if no token
    }

    console.log('Form submission started...');
   
    const formData = new FormData();
    Object.keys(this.applyForm.value).forEach((key) =>
      formData.append(key, this.applyForm.value[key])
    );
    formData.append('identity_proof', this.selectedFile);

    this.applyFormService.submitApplication(formData).subscribe({
      next: (response) => {
        console.log('Solicitud enviada con éxito:', response);
        this.formSubmitted = true;
        Swal.fire('Éxito', '¡Solicitud enviada con éxito!', 'success'); // SweetAlert2 success message
        this.applyForm.reset();
      },
      error: (error) => {
        console.error('Error al enviar la solicitud:', error);
        if (error.status === 500 && error.error.message === "Database error") {
          Swal.fire('Error', 'Ya existe una solicitud de crédito para este usuario. Por favor, verifica el estado de tu solicitud.', 'error');
        } else if (error.status === 401) {
          Swal.fire('No Autorizado', 'Acceso no autorizado. Por favor, inicia sesión nuevamente.', 'error'); // SweetAlert2 for unauthorized access
          this.router.navigate(['/login']);
        } else {
          Swal.fire('Error', 'Error al enviar la solicitud. Por favor, inténtalo nuevamente.', 'error'); // SweetAlert2 for general error
        }
      },
    });
  }
}

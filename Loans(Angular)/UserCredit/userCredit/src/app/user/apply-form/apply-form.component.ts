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
        Swal.fire('Invalid File', 'Only PDF, JPG, and PNG files are allowed.', 'warning');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('File Too Large', 'File size cannot exceed 5 MB.', 'warning');
        return;
      }
      this.applyForm.patchValue({ [field]: file });
    }
  }

  onSubmit(): void {
    const token = this.authService.getToken();
    console.log('Token:', token); // Debugging
    if (!token) {
      Swal.fire('Unauthorized', 'Unauthorized access. Redirecting to login page.', 'error'); // SweetAlert2 for unauthorized access
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
          console.log('Application submitted successfully:', response);
          this.formSubmitted = true;
          Swal.fire('Success', 'Application submitted successfully!', 'success'); // SweetAlert2 success message
          this.applyForm.reset();
        },
        error: (error) => {
          console.error('Error submitting application:', error);
          if (error.status === 500 && error.error.message === "Database error") {
            // Custom SweetAlert for "A credit application already exists" error
            Swal.fire('Error', 'A credit application already exists for this user. Please check your application status.', 'error');
          } else if (error.status === 401) {
            Swal.fire('Unauthorized', 'Unauthorized access. Please log in again.', 'error'); // SweetAlert2 for unauthorized access
            this.router.navigate(['/login']);
          } else {
            Swal.fire('Error', 'Error submitting application. Please try again.', 'error'); // SweetAlert2 for general error
          }
        },
      });
    
  }
  
  
}

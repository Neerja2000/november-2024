import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';


@Component({
  selector: 'app-apply-form',
  templateUrl: './apply-form.component.html',
  styleUrls: ['./apply-form.component.css']
})
export class ApplyFormComponent implements OnInit {
  applyForm!: FormGroup;
  selectedFile!: File;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private applyFormService:UserLoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applyForm = this.fb.group({
      full_name: ['', Validators.required],
      address: ['', Validators.required],
      contact_details: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      monthly_income: [0, Validators.required],
      employer_name: ['', Validators.required],
      employment_type: ['', Validators.required],
    });

    // Check login status
  
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    const token = this.authService.getToken();
    console.log('Token:', token); // Debugging
    if (!token) {
      alert('Unauthorized access. Redirecting to login page.');
      this.router.navigate(['/login']);
      return; // Stop further code execution if no token
    }
  
    console.log('Form submission started...');
    if (this.applyForm.valid && this.selectedFile) {
      const formData = new FormData();
      Object.keys(this.applyForm.value).forEach((key) =>
        formData.append(key, this.applyForm.value[key])
      );
      formData.append('identity_proof', this.selectedFile);
  
      this.applyFormService.submitApplication(formData).subscribe({
        next: (response) => {
          console.log('Application submitted successfully:', response);
          alert('Application submitted successfully!');
          this.applyForm.reset();
        },
        error: (error) => {
          console.error('Error submitting application:', error);
          if (error.status === 401) {
            alert('Unauthorized access. Please log in again.');
            this.router.navigate(['/login']);
          } else {
            alert('Error submitting application. Please try again.');
          }
        },
      });
    } else {
      alert('Please fill all fields and upload a document.');
    }
  }
  
  
}

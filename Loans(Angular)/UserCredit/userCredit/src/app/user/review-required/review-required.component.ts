import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-required',
  templateUrl: './review-required.component.html',
  styleUrls: ['./review-required.component.css']
})
export class ReviewRequiredComponent implements OnInit {
  applyForm!: FormGroup;
  selectedFile!: File;
  formSubmitted: boolean = false;
  creditApplications: any[] = [];
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private applyFormService: UserLoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applyForm = this.fb.group({
      full_name: [''],
      address: [''],
      contact_details: [
        '',
        ,
      ],
      monthly_income: [0, ],
      employer_name: [''],
      employment_type: [''],
    });
    this.fetchAndPopulateData();
  }

  fetchAndPopulateData(): void {
    this.applyFormService.getCreditApplications().subscribe({
      next: (data) => {
        const application = data.creditApplications[0]; // Assuming single application for the user
        if (application) {
          this.applyForm.patchValue({
            full_name: application.full_name,
            address: application.address,
            contact_details: application.contact_details,
            monthly_income: application.monthly_income,
            employer_name: application.employer_name,
            employment_type: application.employment_type,
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching credit applications:', err);
        Swal.fire(
          'Error',
          'Failed to fetch application details. Please try again later.',
          'error'
        );
        this.isLoading = false;
      },
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
   

    const token = this.authService.getToken();
    if (!token) {
      Swal.fire('Unauthorized', 'Please log in again.', 'error');
      this.router.navigate(['/login']);
      return;
    }

    const formData = new FormData();
    Object.keys(this.applyForm.value).forEach((key) =>
      formData.append(key, this.applyForm.value[key])
    );
    formData.append('identity_proof', this.selectedFile);

    this.applyFormService.submitApplication(formData).subscribe({
      next: (response) => {
        console.log('Application updated successfully:', response);
        this.formSubmitted = true;
        Swal.fire('Success', 'Application updated successfully!', 'success');
        this.applyForm.reset();
      },
      error: (error) => {
        console.error('Error updating application:', error);
        Swal.fire(
          'Error',
          'Error updating application. Please try again later.',
          'error'
        );
      },
    });
  }
}
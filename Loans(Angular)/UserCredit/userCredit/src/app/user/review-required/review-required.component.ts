import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selectedFiles: { [key: string]: File | null } = {
    identity_proof: null,
    proof_of_residence: null,
    proof_of_income: null,
  };
  formSubmitted: boolean = false;
  creditApplications: any[] = [];
  isLoading: boolean = true;
  reviewMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private applyFormService: UserLoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize form with required fields
    this.applyForm = this.fb.group({
      applicationId: [''],
      full_name: ['', Validators.required],
      address: ['', Validators.required],
      contact_details: ['', Validators.required],
      monthly_income: [0, [Validators.required, Validators.min(1)]],
      employer_name: [''],
      employment_type: [''],
    });

    const applicationId = this.route.snapshot.paramMap.get('applicationId');
    if (applicationId) {
      this.applyForm.patchValue({ applicationId });
      console.log('Application ID patched:', applicationId);
    }

    this.fetchAndPopulateData();
  }

  fetchAndPopulateData(): void {
    this.applyFormService.getCreditApplications().subscribe({
      next: (data) => {
        const application = data.creditApplications[0]; 
        if (application) {
          this.applyForm.patchValue({
            full_name: application.full_name,
            address: application.address,
            contact_details: application.contact_details,
            monthly_income: application.monthly_income,
            employer_name: application.employer_name,
            employment_type: application.employment_type,
          });
          this.reviewMessage = application.review_message || 'No review message available.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching credit applications:', err);
        Swal.fire('Error', 'Failed to fetch application details. Please try again later.', 'error');
        this.isLoading = false;
      },
    });
  }

  onFileSelected(event: any, fileType: string): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[fileType] = file;
      console.log(`${fileType} file selected:`, file.name);
    }
  }

  onSubmit(): void {
    if (!this.applyForm.valid) {
      Swal.fire('Error', 'Please complete all required fields before submitting.', 'error');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      Swal.fire('Unauthorized', 'Please log in again.', 'error');
      this.router.navigate(['/login']);
      return;
    }

    const applicationId = this.applyForm.value.applicationId;
    if (!applicationId) {
      Swal.fire('Error', 'Application ID is missing.', 'error');
      return;
    }

    const formData = new FormData();
    Object.keys(this.applyForm.value).forEach((key) => {
      formData.append(key, this.applyForm.value[key]);
    });

    // Append selected files
    for (const key in this.selectedFiles) {
      if (this.selectedFiles[key]) {
        formData.append(key, this.selectedFiles[key]!);
      }
    }

    this.applyFormService.updateApplication(applicationId, formData).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Application updated successfully!', 'success');
        this.applyForm.reset();
        this.formSubmitted = true;
      },
      error: (error) => {
        console.error('Error updating application:', error);
        Swal.fire('Error', 'Error updating application. Please try again later.', 'error');
      },
    });
  }
}

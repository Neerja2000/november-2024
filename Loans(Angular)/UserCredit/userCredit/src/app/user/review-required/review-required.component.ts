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
  selectedFile!: File;
  formSubmitted: boolean = false;
  creditApplications: any[] = [];
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private applyFormService: UserLoginService,
    private router: Router,
    private route:ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize the form before using it
    this.applyForm = this.fb.group({
      applicationId: [''],
      full_name: [''],
      address: [''],
      contact_details: ['', Validators.required],
      monthly_income: [0, Validators.required],
      employer_name: [''],
      employment_type: [''],
    });
  
    const applicationId = this.route.snapshot.paramMap.get('applicationId');
  console.log('Application ID from URL:', applicationId);

  if (applicationId) {
    this.applyForm.patchValue({ applicationId });
    console.log('Application ID patched into the form:', applicationId);
  } else {
    console.warn('Application ID is missing in the URL or not found in paramMap.');
  }

  this.fetchAndPopulateData();

  }
  

  fetchAndPopulateData(): void {
    this.applyFormService.getCreditApplications().subscribe({
      next: (data) => {
        const application = data.creditApplications[0]; // Assuming single application for the user
        if (application) {
          this.applyForm.patchValue({
       // Set the applicationId
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
    console.log('Form Submission Initiated');
  
    // Retrieve token for authentication
    const token = this.authService.getToken();
    console.log('Retrieved Token:', token);
  
    if (!token) {
      Swal.fire('Unauthorized', 'Please log in again.', 'error');
      this.router.navigate(['/login']);
      return;
    }
  
    // Retrieve applicationId from the form
    const applicationId = this.applyForm.value.applicationId;
    console.log('Application ID from form:', applicationId);
    console.log('Full Form Values:', this.applyForm.value);
  
    if (!applicationId) {
      console.error('Application ID is missing, form values:', this.applyForm.value);
      Swal.fire('Error', 'Application ID is missing.', 'error');
      return;
    }
  
    // Prepare formData for submission
    const formData = new FormData();
    Object.keys(this.applyForm.value).forEach((key) => {
      console.log(`Appending key: ${key}, value: ${this.applyForm.value[key]}`);
      formData.append(key, this.applyForm.value[key]);
    });
    if (this.selectedFile) {
      console.log('Appending selected file:', this.selectedFile.name);
      formData.append('identity_proof', this.selectedFile);
    } else {
      console.warn('No file selected for identity_proof');
    }
  
    console.log('Final FormData prepared:', formData);
  
    // Pass the applicationId along with formData to the updateApplication method
    this.applyFormService.updateApplication(applicationId, formData).subscribe({
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

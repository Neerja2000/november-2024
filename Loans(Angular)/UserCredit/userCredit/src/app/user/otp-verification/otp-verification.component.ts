import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css'],
})
export class OtpVerificationComponent implements OnInit {
  otpForm!: FormGroup;
  otpFields = Array(6).fill(null); // Represents 6 OTP input fields
  phone_number: string = ''; // Store phone number from query params
  
  constructor(
    private fb: FormBuilder,
    private userLoginService: UserLoginService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize OTP form and fetch phone number from query parameters
    this.otpForm = this.fb.group({
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Ensure valid phone number
      ...this.createOtpControls(),
    });

    this.route.queryParams.subscribe((params) => {
      this.phone_number = params['phone_number'] || ''; // Set phone number from URL params
      this.otpForm.patchValue({ phone_number: this.phone_number }); // Patch phone number into the form
    });
  }

  // Dynamically creates form controls for OTP fields
  private createOtpControls() {
    const controls: { [key: string]: any } = {};
    for (let i = 0; i < 6; i++) {
      controls[`otp${i}`] = ['', [Validators.required, Validators.pattern('^[0-9]$')]]; // Ensure OTP is a digit
    }
    return controls;
  }

  // Combine OTP fields into a single string
  private getOtpString(): string {
    return this.otpFields.map((_, i) => this.otpForm.get(`otp${i}`)?.value).join('');
  }

  // Trigger OTP verification process
  onVerifyOTP(): void {
    const phoneNumber = this.otpForm.get('phone_number')?.value;
    const otpString = this.getOtpString();

    // Ensure OTP is valid (6 digits)
    if (otpString.length !== 6 || isNaN(Number(otpString))) {
      Swal.fire('Error', 'Please enter a valid 6-digit OTP.', 'error'); // SweetAlert2 error message
      return;
    }

    // Convert OTP string to a number
    const otp = Number(otpString);

    // Log request payload for debugging
    console.log('Request Payload:', { phone_number: phoneNumber, otp });

    // Call the API to verify OTP
    this.userLoginService.verifyOTP(phoneNumber, otp).subscribe({
      next: (response) => {
        console.log('OTP Verified Successfully:', response);
        // Store data and navigate on success
        this.authService.storedata(response);
        Swal.fire('Success', 'OTP Verified Successfully', 'success'); 
        this.router.navigate(['user/layout/home']);
      },
      error: (error) => {
        console.error('OTP Verification Failed:', error);
        Swal.fire('Error', 'Invalid OTP. Please try again.', 'error'); // SweetAlert2 error message
      },
    });
  }
}

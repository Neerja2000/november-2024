import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css'],
})
export class OtpVerificationComponent implements OnInit {
  otpForm!: FormGroup;
  otpFields = Array(6).fill(null); // Represents 6 OTP input fields

  constructor(
    private fb: FormBuilder,
    private userLoginService: UserLoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      ...this.createOtpControls(),
    });
  }

  // Dynamically creates form controls for OTP fields
  private createOtpControls() {
    const controls: { [key: string]: any } = {};
    for (let i = 0; i < 6; i++) {
      controls[`otp${i}`] = ['', [Validators.required, Validators.pattern('^[0-9]$')]];
    }
    return controls;
  }

  // Combine OTP fields into a single string
  private getOtpString(): string {
    return this.otpFields.map((_, i) => this.otpForm.get(`otp${i}`)?.value).join('');
  }

  onVerifyOTP(): void {
    if (this.otpForm.invalid) {
      alert('Please fill in all fields correctly.');
      return;
    }
  
    const phoneNumber = this.otpForm.get('phone_number')?.value; // Fixed reference
    const otpString = this.getOtpString();
  
    if (otpString.length !== 6 || isNaN(Number(otpString))) {
      alert('Please enter a valid 6-digit OTP.');
      return;
    }
  
    // Convert OTP string to number
    const otp = Number(otpString);
  
    console.log('Request Payload:', { phone_number: phoneNumber, otp }); // Log the payload
  
    this.userLoginService.verifyOTP(phoneNumber, otp).subscribe({
      next: (response) => {
        console.log('OTP Verified Successfully:', response);
        alert('OTP Verified Successfully');
        this.router.navigate(['user/layout/home']);
      },
      error: (error) => {
        console.error('OTP Verification Failed:', error);
        alert('Invalid OTP. Please try again.');
      },
    });
  }
  

}

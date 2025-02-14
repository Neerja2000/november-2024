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
  phone_number: string = '';  // To store phone number from query params
  otpValue: string = '';  // To store OTP for autofill
  otpFields: string[] = Array(6).fill('');  // For 6 OTP input fields

  constructor(
    private fb: FormBuilder,
    private userLoginService: UserLoginService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize OTP form with dynamic controls for each digit
    this.otpForm = this.fb.group({
      phone_number: ['', [Validators.required]],
    });
    for (let i = 0; i < 6; i++) {
      this.otpForm.addControl('otp' + i, this.fb.control('', [Validators.required, Validators.pattern(/^\d$/)]));  // Add control for each OTP digit
    }

    // Fetch phone number and OTP from the query parameters
    this.route.queryParams.subscribe((params) => {
      this.phone_number = params['phone_number'] || '';
      this.otpValue = params['otp'] || '';  // Autofill OTP value
      this.otpForm.patchValue({ phone_number: this.phone_number });

      // Autofill OTP fields
      if (this.otpValue) {
        this.autoFillOtp(this.otpValue);
      }
    });
    console.log('Phone Number:', this.phone_number);
    console.log('OTP:', this.otpValue);
  }

  // Auto-fill OTP input fields
  private autoFillOtp(otp: string): void {
    this.otpFields = otp.split('');
    this.otpFields.forEach((digit, index) => {
      this.otpForm.get('otp' + index)?.setValue(digit);  // Set the value of each individual OTP field
    });
  }

  // Get OTP as a string
  private getOtpString(): string {
    return this.otpFields.join('');
  }

  // Submit OTP verification
  onVerifyOTP(): void {
    const phoneNumber = this.otpForm.get('phone_number')?.value;  // Ensure phone number is fetched correctly
    const otp = this.getOtpString();  // Get the OTP from the input fields
    console.log("OTP from input:", otp);
    console.log("Phone Number from form:", phoneNumber);  // Check phone number value
  
    if (otp.length !== 6 || isNaN(Number(otp))) {
      Swal.fire('Error', 'Por favor ingrese un OTP válido de 6 dígitos.', 'error');
      return;
    }
  
    // Convert OTP to a number
    const otpNumber = Number(otp);
  
    // Ensure phoneNumber is not undefined before making the request
    if (!phoneNumber) {
      Swal.fire('Error', 'El número de teléfono es requerido.', 'error');
      return;
    }

    // Call the API to verify OTP
    this.userLoginService.verifyOTP(phoneNumber, otpNumber).subscribe({
      next: (response) => {
        console.log('OTP Verificado:', response);
        if (response.token) {
          this.authService.storedata(response);
          Swal.fire('Éxito', 'OTP verificado correctamente', 'success');
          this.router.navigate(['user/layout/home']);
        } else {
          Swal.fire('Error', 'Falló la verificación del OTP.', 'error');
        }
      },
      error: (error) => {
        console.error('Error en la verificación del OTP:', error);
        Swal.fire('Error', 'La verificación del OTP falló. Por favor intente más tarde.', 'error');
      },
    });
  }
}

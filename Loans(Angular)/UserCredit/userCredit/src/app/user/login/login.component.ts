import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';
// Import AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userLoginService: UserLoginService,
    private authService:AuthService,  // Inject AuthService
    private router: Router
  ) {
    // Initialize the loginForm
    this.loginForm = this.fb.group({
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Registration form submission logic
  onSubmit() {
    console.log('hello');
    if (this.registrationForm.valid) {
      const phoneNumber = this.registrationForm.value.phone_number;
  
      this.userLoginService
        .register(
          this.registrationForm.value.name,
          this.registrationForm.value.email,
          phoneNumber,
          this.registrationForm.value.password
        )
        .subscribe({
          next: (response) => {
            console.log('Registration successful:', response);
            alert('Registration successful! Please verify your OTP.');
  
            // Pass phone number as a query parameter
            this.router.navigate(['/otp-verification'], { queryParams: { phone_number: phoneNumber } });
          },
          error: (err) => {
            console.error('Registration failed:', err);
            alert('Registration failed. Please try again.');
          },
        });
    } else {
      console.log('Form is invalid');
    }
  }
  

  // Login form submission logic
  onLogin(): void {
    console.log('Login form data:', this.loginForm.value);
    console.log('hello login');
    if (this.loginForm.valid) {
      const { phone_number, password } = this.loginForm.value;
      console.log(
        'Form valid. Attempting to log in with phone:',
        phone_number,
        'and password:',
        password
      );

      this.userLoginService.login(phone_number, password).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          if (response.token) {
            console.log('Login successful:', response);

            // Store token using AuthService
            this.authService.storedata(response); 

            // Navigate to OTP verification page
            this.router.navigate(['user/layout/home']);
          } else {
            console.error('Login failed: Token not received');
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          console.log('Error details:', error.error);
        },
      });
    } else {
      console.error('Invalid form data:', this.loginForm.value);
    }
  }
}

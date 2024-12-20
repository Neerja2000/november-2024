import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registrationForm!: FormGroup;
  countries: { name: string; code: string }[] = [];
  selectedCountryCode: string = '';

  constructor(
    private fb: FormBuilder,
    private userLoginService: UserLoginService,
    private authService: AuthService,  // Inject AuthService
    private router: Router,
    private http: HttpClient
  ) {
    // Initialize the loginForm
    this.loginForm = this.fb.group({
      phone_number: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      countryCode: [''], // Add country code control
    });
    this.fetchCountries();
  }


  fetchCountries(): void {
    this.http
      .get<any[]>('https://restcountries.com/v3.1/all?fields=name,idd')
      .subscribe({
        next: (data) => {
          const allowedCountries = ['India', 'Mexico', 'United States']; // Add countries you want to include
          this.countries = data
            .filter(
              (country) =>
                allowedCountries.includes(country.name.common) &&
                country.idd &&
                country.idd.root &&
                country.idd.suffixes &&
                country.idd.suffixes.length > 0
            )
            .map((country) => ({
              name: country.name.common,
              code: `${country.idd.root}${country.idd.suffixes[0]}`,
            }));
  
          // Default to the first country in the list
          this.selectedCountryCode = this.countries[0]?.code || '';
          this.registrationForm.patchValue({ countryCode: this.selectedCountryCode });
        },
        error: (err) => console.error('Error fetching countries:', err),
      });
  }
  

  onCountryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCountryCode = target.value;
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      Swal.fire('Error', 'Please fill in all fields correctly.', 'error');
      return;
    }
  
    this.userLoginService
    .register(
      this.registrationForm.value.name,
      this.registrationForm.value.email,
      this.registrationForm.value.phone_number,
      this.registrationForm.value.password
    )
    .subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        Swal.fire('Success', 'Registration successful! Please verify your OTP.', 'success');
        this.router.navigate(['/otp-verification'], {
          queryParams: { phone_number: this.registrationForm.value.phone_number, otp: response.otp },
        });
      },
      error: (err) => {
        console.error('Registration failed:', err);
        Swal.fire('Error', err.error.message ,'error');
      },
    });
  
  }
  
  
  
  

  // Login form submission logic
  onLogin(): void {
    console.log("hello")
    if (this.loginForm.invalid) {
      Swal.fire('Error', 'Please fill in all fields correctly.', 'error'); // Show error for invalid form
      return;
    }

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

            // Show success message
            Swal.fire('Success', 'Login successful! Redirecting...', 'success'); // SweetAlert2 success message

            // Navigate to the home page
            this.router.navigate(['user/layout/home']);
          } else {
            console.error('Login failed: Token not received');
            Swal.fire('Error', 'Login failed. Please check your credentials.', 'error'); // SweetAlert2 error message
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          console.log('Error details:', error.error);
          Swal.fire('Error', 'Login failed. Please try again later.', 'error'); // SweetAlert2 error message
        },
      });
    } else {
      console.error('Invalid form data:', this.loginForm.value);
    }
  }
}

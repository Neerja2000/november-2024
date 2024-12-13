import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { LoginService } from 'src/app/shared/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm = new FormGroup({
    'email': new FormControl(''),
    'password': new FormControl('')
  });

  constructor(private loginService: LoginService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
  
      this.loginService.loginapi(loginData).subscribe(
        (res: any) => {
          console.log('API Response:', res);
  
          // Store the token in sessionStorage using AuthService
          if (res && res.token) {
            this.authService.storeData(res.token); // Save the token
            console.log('Token stored successfully');
          } else {
            console.error('Token is missing in API response');
          }
  
          // Navigate to the dashboard or other page
          this.router.navigate(['/layout/dashboard']); // Example redirection
  
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You have logged in successfully!',
          });
        },
        (err: any) => {
          console.error('API Error:', err);
  
          if (err.status === 401) {
            // Unauthorized, wrong credentials
            Swal.fire({
              icon: 'error',
              title: 'Invalid Credentials',
              text: 'The email or password you entered is incorrect. Please try again.',
            });
          } else if (err.status === 500) {
            // Server error
            Swal.fire({
              icon: 'error',
              title: 'Server Error',
              text: 'There was an issue with the server. Please try again later.',
            });
          } else {
            // General error
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An unexpected error occurred. Please try again.',
            });
          }
        }
      );
    } else {
      console.log('Invalid form data');
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly.',
      });
    }
  }
  
}

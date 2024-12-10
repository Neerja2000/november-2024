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
loginForm=new FormGroup({
  'email':new FormControl(''),
  'password':new FormControl('')
})
constructor(private loginService:LoginService,private authService:AuthService,private router:Router){}
ngOnInit(): void {
  
}
login() {
  console.log('Login function called');
  if (this.loginForm.valid) {
    const loginData = this.loginForm.value;

    this.loginService.loginapi(loginData).subscribe(
      (res: any) => {
        console.log('API Response:', res);
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have logged in successfully!',
        });
      },
      (err: any) => {
        console.error('API Error:', err);
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



import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { LoginService } from 'src/app/shared/login/login.service';

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
  if (this.loginForm.valid) {
    const loginData = this.loginForm.value;

    this.loginService.loginapi(loginData).subscribe(
      (res: any) => {
        console.log('Login Successful', res);
        if (res.token) {
          this.authService.storeData(res.token); // Store token
          this.router.navigateByUrl('/layout/dashboard');
        } else {
          console.error('No token found in response');
        }
      },
      (err: any) => {
        console.error('Login Failed', err);
      }
    );
  } else {
    console.log('Invalid form data');
  }
}
}



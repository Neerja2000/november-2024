import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
ngOnInit(): void {
  
}
login(){
  console.log(this.loginForm.value)
}
}

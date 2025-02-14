import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private authservice:AuthService ,private router: Router){}
canActivate():boolean{
    if(this.authservice.getToken()==null){
        this.router.navigateByUrl("/adminLogin")
        return false
    }
    else{
        return true
    }
}
}
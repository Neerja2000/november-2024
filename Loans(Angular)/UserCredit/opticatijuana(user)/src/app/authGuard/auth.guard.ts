import { Injectable } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate
{
    constructor(private authservice:AuthService,private router:Router){}
    canActivate():boolean{
        if(this.authservice.getToken()==null)
        {
            this.router.navigateByUrl("/login")
            return false
        }
        else{
            return true
        }
    }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  adminbaseurl:any
  token:any
  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any,private authService:AuthService) 
  { 
    this.adminbaseurl=_baseurl
    this.token=this.authService.getToken()
  }
  userApplications(){
    return this.http.get(this.adminbaseurl+'/applications')
  }
  changeStatus(applicationId: number, status: string) {
    const headers = new HttpHeaders().set('auth-token', this.token);
    const body = { applicationId, status }; // Construct the body with the applicationId and status
    return this.http.post(this.adminbaseurl + '/application/status', body, { headers });
  }
}

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
  changeStatus(applicationId: number, status: string, reviewMessage: string, userId: number) {
    const headers = new HttpHeaders().set('auth-token', this.token);
  
    const body = {
      applicationId,
      status,
      reviewMessage, // Add the review message if available
      userId
    };
  
    return this.http.post(this.adminbaseurl + '/application/status', body, { headers });
  }


creditAdded(body: { userId: number; creditLimit: number }) {
  const headers = new HttpHeaders().set('auth-token', this.token);
  console.log('Sending credit limit update request with body:', body); // Debug log

  return this.http.post(this.adminbaseurl + '/credit-limit', body, { headers });
}

}

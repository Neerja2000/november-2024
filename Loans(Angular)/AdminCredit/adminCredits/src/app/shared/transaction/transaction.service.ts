import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  adminbaseurl:any
  token:any
  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any,private authService:AuthService) 
  { 
    this.adminbaseurl=_baseurl
    this.token=this.authService.getToken()
    console.log("jj",this.token)
  }



  transactionAdd(transactionData: any) {
    const headers = new HttpHeaders().set('auth-token', this.token);
  
    return this.http.post(`${this.adminbaseurl}/transaction`, transactionData, { headers });
  }
  

  creditAdded(body: { userId: number; creditLimit: number }) {
    const headers = new HttpHeaders().set('auth-token', this.token);
    console.log('Sending credit limit update request with body:', body); // Debug log
  
    return this.http.post(this.adminbaseurl + '/credit-limit', body, { headers });
  }

}

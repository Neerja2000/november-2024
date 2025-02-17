import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  adminbaseurl:any;
  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any) 
  { 
    this.adminbaseurl=_baseurl
  }
 
  loginapi(body: any) {
    return this.http.post(this.adminbaseurl + '/login', body);
  }



  sendResetEmail(email: string): Observable<any> {
    return this.http.post<any>(this.adminbaseurl+'/for', { email });
  }
}

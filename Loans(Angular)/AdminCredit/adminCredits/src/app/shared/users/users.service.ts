import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  adminbaseurl:any
  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any) 
  { 
    this.adminbaseurl=_baseurl
  }
  userApplications(){
    return this.http.get(this.adminbaseurl+'/applications')
  }
  userImage()
  {
    return 
  }
}

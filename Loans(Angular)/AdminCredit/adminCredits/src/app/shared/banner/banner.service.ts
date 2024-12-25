import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

 adminbaseurl:any
   token:any
   constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any,private authService:AuthService) 
   { 
     this.adminbaseurl=_baseurl
     this.token=this.authService.getToken()
   }
   
}

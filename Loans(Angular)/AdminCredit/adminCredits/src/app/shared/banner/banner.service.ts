import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

 bannerbaseurl:any
   token:any
   constructor(private http:HttpClient,@Inject('bannerurl')_bannerurl:any,private authService:AuthService) 
   { 
     this.bannerbaseurl=_bannerurl
     this.token=this.authService.getToken()
   }
   addBanner(formData: FormData) {
    const headers = new HttpHeaders().set('auth-token', this.token);
    return this.http.post(`${this.bannerbaseurl}/banners`, formData, { headers });
}

}

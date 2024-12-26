import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})


export class BannerService {

  bannerbaseurl:any
  
    constructor(private http:HttpClient,@Inject('bannerurl')_bannerurl:any,private authService:AuthService) 
    { 
      this.bannerbaseurl=_bannerurl
     
    }
  
  
  
  
  
  
 getBanners() {
   
   return this.http.get(this.bannerbaseurl + '/banners');
 }
  
 toggleBannerStatus(bannerId: number, isActive: boolean) {
   
   const body = { is_active: isActive };
   return this.http.patch(
     `${this.bannerbaseurl}/banners/${bannerId}/toggle`,
     body
   );
 }
 
  
 
 }
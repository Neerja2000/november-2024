import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

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
 
 
 
 
 
getBanners() {
  const headers = new HttpHeaders().set('auth-token', this.token);
  return this.http.get(this.bannerbaseurl + '/banners', { headers });
}
 
toggleBannerStatus(bannerId: number, isActive: boolean) {
  const headers = new HttpHeaders().set('auth-token', this.token);
  const body = { is_active: isActive };
  return this.http.patch(
    `${this.bannerbaseurl}/banners/${bannerId}/toggle`,
    body,
    { headers }
  );
}

deleteBanner(bannerId: number){
   const headers = new HttpHeaders().set('auth-token', this.token);
   return this.http.delete(
    `${this.bannerbaseurl}/banners/${bannerId}`,
   
    { headers }
  );
}
updateBanner(bannerId: number, formData: FormData): Observable<any> {
  const headers = new HttpHeaders().set('auth-token', this.token);

  return this.http.put<any>(`${this.bannerbaseurl}/banners/${bannerId}`, formData, { headers });
}

getBannerById(bannerId: number) {
  return this.http.get(`${this.bannerbaseurl}/banners/${bannerId}`);
}

 

}
 
 
 
 
 

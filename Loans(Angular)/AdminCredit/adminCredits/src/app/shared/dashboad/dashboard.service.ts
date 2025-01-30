import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
 adminbaseurl:any
  token:any
  constructor(private http:HttpClient,@Inject('baseurl')_baseurl:any,private authService:AuthService) 
  { 
    this.adminbaseurl=_baseurl
    this.token=this.authService.getToken()
  }
  getAllEmis(): Observable<any[]> {
    const headers = new HttpHeaders().set('auth-token', this.token);
    return this.http.get<any[]>(`${this.adminbaseurl}/emis`, { headers });
  }


  getAllDashboard(): Observable<any[]> {
    const headers = new HttpHeaders().set('auth-token', this.token);
    return this.http.get<any[]>(`${this.adminbaseurl}/dashboard-counts`, { headers });
  }
  
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  private globalbaseurl: any;

  constructor(private http: HttpClient, @Inject('baseurl') _baseurl: string,private authService:AuthService) {
    this.globalbaseurl = _baseurl;
  }



  register(name: string, email: string, phone_number: string, password: string): Observable<any> {
    const url = `${this.globalbaseurl}/register`;
    const requestBody = { name, email, phone_number, password };
    return this.http.post(url, requestBody);
  }

  login(phone_number: string, password: string): Observable<any> {
    console.log('Login payload:', { phone_number, password });
    const url = `${this.globalbaseurl}/login`;
    const requestBody = { phone_number, password };
    return this.http.post(url, requestBody);
  }

  verifyOTP(phone_number: string, otp: number): Observable<any> {
    const url = `${this.globalbaseurl}/verify-otp`;
    const requestBody = { phone_number, otp };
    console.log('Received request:', requestBody);
    return this.http.post(url, requestBody);
  }

  submitApplication(formData: FormData): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    
    // If no token is found, return early with an error or handle the scenario
    if (!token) {
      console.error('No authentication token found');
      throw new Error('No authentication token found');
    }
  
    const headers = new HttpHeaders().set('auth-token', token); // Use 'auth-token' as the custom header name
    return this.http.post(`${this.globalbaseurl}/credit-application`, formData, { headers });
  }


  updateApplication(applicationId: string, formData: FormData): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
    
    // If no token is found, return early with an error or handle the scenario
    if (!token) {
      console.error('No authentication token found');
      throw new Error('No authentication token found');
    }
  
    const headers = new HttpHeaders().set('auth-token', token); // Use 'auth-token' as the custom header name
    
    // Adjust the URL to include the applicationId
    const url = `${this.globalbaseurl}/users/applications/${applicationId}`;
    
    return this.http.put(url, formData, { headers });
  }
  
  getCreditApplications(): Observable<any> {
    const token = this.authService.getToken(); // Retrieve token from AuthService
  
    if (!token) {
      console.error('No authentication token found');
      throw new Error('No authentication token found');
    }
  
    const headers = new HttpHeaders().set('auth-token', token); // Custom header
    return this.http.get(`${this.globalbaseurl}/details-with-credit-applications`, { headers });
  }
  



  userCreditDetails(){
    const token = this.authService.getToken(); // Retrieve token from AuthService
  
    if (!token) {
      console.error('No authentication token found');
      throw new Error('No authentication token found');
    }
  
    const headers = new HttpHeaders().set('auth-token', token); // Custom header
    return this.http.get(`${this.globalbaseurl}/details_with_credit_applications`, { headers });
  }
}

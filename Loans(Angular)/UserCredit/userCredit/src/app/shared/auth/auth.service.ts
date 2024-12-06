import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  storedata(res: any): void {
    console.log('Response received:', res); // Log the full response
    console.log('Token to store:', res.token); // Log the token value
    sessionStorage.setItem('token', res.token); // Ensure this matches the response key
  }

  getToken() {
    const token = sessionStorage.getItem('token');
    console.log('Retrieved Token:', token); // Log the retrieved token
    return token;
  }

  removedata() {
    sessionStorage.removeItem('token');
  }

  constructor() {}
}

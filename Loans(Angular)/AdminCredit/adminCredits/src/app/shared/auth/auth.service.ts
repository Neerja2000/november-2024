import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  storeData(token: string) {
    console.log('Token to store:', token);
    sessionStorage.setItem('token', token);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  removeData() {
    sessionStorage.removeItem('token');
  }
}

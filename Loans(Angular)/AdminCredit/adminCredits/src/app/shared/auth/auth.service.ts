import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  storeData(data:any)
  {
    console.log('Token to store:', data.token);
    sessionStorage.setItem('token',data.token)
  }
  getToken(){
    return sessionStorage.getItem('token')
  }
  removedata(){
    sessionStorage.removeItem('token')
  }
}

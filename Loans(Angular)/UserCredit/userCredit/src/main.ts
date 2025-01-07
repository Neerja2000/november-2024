import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
export function getbaseurl(){
  return "https://api-docs.opticatijuana.com/api/users"
 }
 export function bannerbaseurl(){
  return "https://api-docs.opticatijuana.com/api/banner"
 }
 const provider=[
  {
    provide:'baseurl',useFactory:getbaseurl,desp:[]
  },
  {
    provide:'bannerurl',useFactory:bannerbaseurl,desp:[]
  }
 ]

platformBrowserDynamic(provider).bootstrapModule(AppModule)
  .catch(err => console.error(err));

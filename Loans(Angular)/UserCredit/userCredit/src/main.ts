import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
export function getbaseurl(){
  return "http://208.109.247.10:7700/api/users"
 }
 export function bannerbaseurl(){
  return "http://208.109.247.10:7700/api/banner"
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

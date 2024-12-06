import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
export function getbaseurl(){
  return "http://194.238.17.235:7700/api/users"
 }
 const provider=[
  {
    provide:'baseurl',useFactory:getbaseurl,desp:[]
  }
 ]

platformBrowserDynamic(provider).bootstrapModule(AppModule)
  .catch(err => console.error(err));

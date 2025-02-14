import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


export function adminbaseurl(){
return 'https://api-docs.opticatijuana.com/api/admin'
}
export function bannerbaseurl(){
  return 'https://api-docs.opticatijuana.com/api/banner'
  }
const provider=[
  {
    provide:'baseurl',useFactory:adminbaseurl,desp:[]
  },
  {
    provide:'bannerurl',useFactory:bannerbaseurl,desp:[]
  }
]


platformBrowserDynamic(provider).bootstrapModule(AppModule)
  .catch(err => console.error(err));

  
 
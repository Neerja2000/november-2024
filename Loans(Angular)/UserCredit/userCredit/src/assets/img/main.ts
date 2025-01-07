import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


export function adminbaseurl(){
return 'http://208.109.247.10:7700/api/admin'
}
export function bannerbaseurl(){
  return 'http://208.109.247.10:7700/api/banner'
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

  
 
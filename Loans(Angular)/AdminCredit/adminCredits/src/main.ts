import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


export function adminbaseurl(){
return 'http://194.238.17.235:7700/api/admin'
}
const provider=[
  {
    provide:'baseurl',useFactory:adminbaseurl,desp:[]
  }
]


platformBrowserDynamic(provider).bootstrapModule(AppModule)
  .catch(err => console.error(err));

  
 
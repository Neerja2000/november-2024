import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './user/layout/layout.component';
import { HomeComponent } from './user/home/home.component';
import { ApplyFormComponent } from './user/apply-form/apply-form.component';


const routes: Routes = [
  {
    path:'',redirectTo:"user/layout/home",pathMatch:'full'
  },
  {
    path:'applyForm',component:ApplyFormComponent
  },
  { path:'user/layout', component:LayoutComponent,
    children:[
      {
        path:'home',component:HomeComponent
      }
    ]

  }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
 
 }

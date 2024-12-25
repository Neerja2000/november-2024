import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserDetailsComponent } from './admin/user-details/user-details.component';
import { ViewUserDetailsComponent } from './admin/view-user-details/view-user-details.component';

import { NewUsersComponent } from './admin/new-users/new-users.component';
import { PrivacyPolicyComponent } from './admin/privacy-policy/privacy-policy.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { EmiDetailsComponent } from './admin/emi-details/emi-details.component';
import { AuthGuard } from './authGuard/auth.guard';
import { BannerFormComponent } from './admin/banner-form/banner-form.component';
import { BannerViewDetailsComponent } from './admin/banner-view-details/banner-view-details.component';

const routes: Routes = [
  {
    path:'',redirectTo:"/adminLogin",pathMatch:'full'
  },
  {
    path:'adminLogin',component:AdminLoginComponent
  },
  {
    path:"layout",component:LayoutComponent,
    children:[
      {
        path:"dashboard",component:DashboardComponent
      },
      {
        path:"userDetails",component:UserDetailsComponent,canActivate:[AuthGuard]
      },
      {
        path:"viewUserDetails/:userId",component:ViewUserDetailsComponent,canActivate:[AuthGuard]
      },
   
      {
        path:'newUser',component:NewUsersComponent,canActivate:[AuthGuard]
      },
      {
        path:"privacyPolicy",component:PrivacyPolicyComponent
      },
      {
        path:'emiDetails/:userId/:transactionId',component:EmiDetailsComponent,canActivate:[AuthGuard]
      },
      {
        path:'addBanner',component:BannerFormComponent,canActivate:[AuthGuard]
      },
      {
        path:'viewBanner',component:BannerViewDetailsComponent,canActivate:[AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

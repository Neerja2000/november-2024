import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './user/layout/layout.component';
import { HomeComponent } from './user/home/home.component';
import { ApplyFormComponent } from './user/apply-form/apply-form.component';
import { LoginComponent } from './user/login/login.component';
import { OtpVerificationComponent } from './user/otp-verification/otp-verification.component';
import { ViewCreditStatusComponent } from './user/view-credit-status/view-credit-status.component';
import { AuthGuard } from './authGuard/auth.guard';
import { AllDetailsComponent } from './user/all-details/all-details.component';
import { EmiDetailsComponent } from './user/emi-details/emi-details.component';
import { ReviewRequiredComponent } from './user/review-required/review-required.component';


const routes: Routes = [
  {
    path:'',redirectTo:"user/layout/home",pathMatch:'full'
  },
  {
    path:'applyForm',component:ApplyFormComponent,canActivate:[AuthGuard]
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'otp-verification',component:OtpVerificationComponent
  },
  {
    path:'review-required/:applicationId',component:ReviewRequiredComponent,canActivate:[AuthGuard]
  },
  { path:'user/layout', component:LayoutComponent,
    children:[
      {
        path:'home',component:HomeComponent
      },
      {
        path:'view-credit-status',component:ViewCreditStatusComponent,canActivate:[AuthGuard]
      },
      {
        path:'all-user-details',component:AllDetailsComponent,canActivate:[AuthGuard]
      },
      { 
        path: 'emi-details/:transactionId', 
        component: EmiDetailsComponent, 
        canActivate: [AuthGuard] 
      },
      
    ]

  }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
 
 }

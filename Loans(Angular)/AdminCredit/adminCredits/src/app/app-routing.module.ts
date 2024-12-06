import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserDetailsComponent } from './admin/user-details/user-details.component';
import { ViewUserDetailsComponent } from './admin/view-user-details/view-user-details.component';
import { ViewProductComponent } from './admin/view-product/view-product.component';
import { NewUsersComponent } from './admin/new-users/new-users.component';
import { PrivacyPolicyComponent } from './admin/privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path:'',redirectTo:"/layout/dashboard",pathMatch:'full'
  },
  {
    path:"layout",component:LayoutComponent,
    children:[
      {
        path:"dashboard",component:DashboardComponent
      },
      {
        path:"userDetails",component:UserDetailsComponent
      },
      {
        path:"viewUserDetails",component:ViewUserDetailsComponent
      },
      {
        path:'viewProduct',component:ViewProductComponent
      },
      {
        path:'newUser',component:NewUsersComponent
      },
      {
        path:"privacyPolicy",component:PrivacyPolicyComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

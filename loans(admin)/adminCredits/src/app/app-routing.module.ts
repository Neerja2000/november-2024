import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UsersComponent } from './admin/users/users.component';
import { ViewProductsComponent } from './admin/view-products/view-products.component';
import { NewUsersComponent } from './admin/new-users/new-users.component';
import { AddProductsComponent } from './admin/add-products/add-products.component';
import { UpdateProductsComponent } from './admin/update-products/update-products.component';
import { UserDetailsComponent } from './admin/user-details/user-details.component';

const routes: Routes = [
  {
    path:'',redirectTo:"admin/layout/dashboard",pathMatch:'full'
  },
  { path:'admin/layout', component:LayoutComponent,
    children:[
      {
        path:'dashboard',component:DashboardComponent
      },
      {
        path:'users',component:UsersComponent
      },
      {
        path:'view-products',component:ViewProductsComponent
      },
      {
        path:'new-users',component:NewUsersComponent
      },
      {
        path:'add-products',component:AddProductsComponent
      },
      {
        path:'update-products',component:UpdateProductsComponent
      },
      {
        path:'user-details',component:UserDetailsComponent
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

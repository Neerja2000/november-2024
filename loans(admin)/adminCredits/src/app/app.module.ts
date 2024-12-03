import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { SidebarComponent } from './admin/layout/sidebar/sidebar.component';
import { FooterComponent } from './admin/layout/footer/footer.component';
import { HeaderComponent } from './admin/layout/header/header.component';
import { UsersComponent } from './admin/users/users.component';
import { UserDetailsComponent } from './admin/user-details/user-details.component';
import { NewUsersComponent } from './admin/new-users/new-users.component';
import { AddProductsComponent } from './admin/add-products/add-products.component';
import { ViewProductsComponent } from './admin/view-products/view-products.component';
import { UpdateProductsComponent } from './admin/update-products/update-products.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LayoutComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    UsersComponent,
    UserDetailsComponent,
    NewUsersComponent,
    AddProductsComponent,
    ViewProductsComponent,
    UpdateProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

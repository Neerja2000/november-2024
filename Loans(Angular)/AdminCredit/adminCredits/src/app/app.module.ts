import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './admin/layout/layout.component';
import { HeaderComponent } from './admin/layout/header/header.component';
import { FooterComponent } from './admin/layout/footer/footer.component';
import { SidebarComponent } from './admin/layout/sidebar/sidebar.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserDetailsComponent } from './admin/user-details/user-details.component';
import { ViewUserDetailsComponent } from './admin/view-user-details/view-user-details.component';
import { ViewProductComponent } from './admin/view-product/view-product.component';
import { PrivacyPolicyComponent } from './admin/privacy-policy/privacy-policy.component';
import { NewUsersComponent } from './admin/new-users/new-users.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import{HttpClientModule}from '@angular/common/http';
import { EmiDetailsComponent } from './admin/emi-details/emi-details.component'

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    UserDetailsComponent,
    ViewUserDetailsComponent,
    ViewProductComponent,
    PrivacyPolicyComponent,
    NewUsersComponent,
    AdminLoginComponent,
    EmiDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './user/home/home.component';
import { LayoutComponent } from './user/layout/layout.component';
import { HeaderComponent } from './user/layout/header/header.component';
import { FooterComponent } from './user/layout/footer/footer.component';
import { SidebarComponent } from './user/layout/sidebar/sidebar.component';
import { ApplyFormComponent } from './user/apply-form/apply-form.component';
import { LoginComponent } from './user/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { OtpVerificationComponent } from './user/otp-verification/otp-verification.component';
import { ViewCreditStatusComponent } from './user/view-credit-status/view-credit-status.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ApplyFormComponent,
    LoginComponent,
    OtpVerificationComponent,
    ViewCreditStatusComponent,
    
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

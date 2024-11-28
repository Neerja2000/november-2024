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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ApplyFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

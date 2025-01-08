import { Component, OnInit } from '@angular/core';
import { BannerService } from 'src/app/shared/banner/banner.service';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isCreditApplied: boolean = false; // Flag to track if credit has been applied
  banners: any[] = [];
  constructor(private userLoginService: UserLoginService,private bannerService:BannerService) {}

  ngOnInit(): void {
    this.fetchBanners();
    this.fetchCreditApplications();
    
  }

  

  fetchCreditApplications(): void {
    this.userLoginService.getCreditApplications().subscribe({
      next: (data) => {
        if (data.creditApplications && data.creditApplications.length > 0) {
          this.isCreditApplied = true;
        } else {
          this.isCreditApplied = false;
        }
      },
      error: (err) => {
        console.error('Error fetching credit applications:', err);
      }
    });
  }
  fetchBanners(): void {
    this.bannerService.getBanners().subscribe(
      (response: any) => {
        console.log("banners", response.banners); // Log the banners for debugging
  
        this.banners = response.banners.filter(
          (banner: any) => banner.is_active === 1 // Only include active banners
        );
  
        console.log('Active banners:', this.banners); // Log active banners
      },
      (error) => {
        console.error('Error fetching banners', error); // Handle errors
      }
    );
  }
  
  
  
  

}


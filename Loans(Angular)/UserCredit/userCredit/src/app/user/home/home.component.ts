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
        console.log("banners", response.banners); // Log the entire response to inspect the structure
    
        this.banners = response.banners
          .filter((banner: any) => banner.is_active === 1) // Only include active banners
          .map((banner: any) => {
            const imageUrl = banner.image_url.startsWith('http')
              ? banner.image_url // If the image URL already starts with 'http', use it directly
              : `http://208.109.247.10:7700/uploads/${banner.image_url}`; // Otherwise, construct the full URL
            
            console.log('Full image URL:', imageUrl); // Log the full image URL
            return {
              ...banner,
              image_url: imageUrl, // Use the correctly constructed URL
            };
          });
      },
      (error) => {
        console.error('Error fetching banners', error);
      }
    );
  }
  
  
  
  

  toggleStatus(banner: any) {
    const newStatus = banner.is_active === 1 ? 0 : 1;
    this.bannerService.toggleBannerStatus(banner.id, newStatus === 1).subscribe(
      (response: any) => {
        banner.is_active = newStatus; // Update the status in the UI
  
        // SweetAlert for success message
        Swal.fire({
          icon: 'success',
          title: newStatus === 1 ? 'Activated!' : 'Deactivated!',
          text: `The banner has been ${newStatus === 1 ? 'activated' : 'deactivated'} successfully.`,
          confirmButtonColor: '#51a992', // Your main color
        });
      },
      (error) => {
        console.error('Error toggling banner status:', error);
  
        // SweetAlert for error message
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'There was an error toggling the banner status. Please try again.',
          confirmButtonColor: '#51a992', // Your main color
        });
      }
    );
  }
}


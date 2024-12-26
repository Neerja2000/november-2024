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
        console.log("banners",response.banners)
        this.banners = response.banners
        
          .filter((banner: any) => banner.is_active === 1) // Only include active banners
          .map((banner: any) => ({
            ...banner,
            image_url: `http://194.238.17.235:7700/uploads/banners/${banner.image_url}`, // Construct the full URL dynamically
          }));
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


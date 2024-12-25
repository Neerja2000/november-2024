import { Component } from '@angular/core';
import { BannerService } from 'src/app/shared/banner/banner.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-banner-view-details',
  templateUrl: './banner-view-details.component.html',
  styleUrls: ['./banner-view-details.component.css']
})
export class BannerViewDetailsComponent {
  banners: any[] = [];

  constructor(private bannerService:BannerService) {}

  ngOnInit(): void {
    this.fetchBanners();
  }

  fetchBanners(): void {
    this.bannerService.getBanners().subscribe(
      (response: any) => {
        this.banners = response.banners.map((banner: any) => ({
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

  deleteBanner(banner: any): void {
    // Show confirmation dialog before deleting
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51a992', // Your main color
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call deleteBanner service
        this.bannerService.deleteBanner(banner.id).subscribe(
          (res: any) => {
            // Show success message
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The banner has been deleted successfully.',
              confirmButtonColor: '#51a992', // Your main color
            });
  
            // Remove the banner from the UI
            const index = this.banners.indexOf(banner);
            if (index > -1) {
              this.banners.splice(index, 1); // Remove banner from the array
            }
          },
          (error) => {
            console.error('Error deleting banner:', error);
            
            // Show error message
            Swal.fire({
              icon: 'error',
              title: 'Oops!',
              text: 'There was an error deleting the banner. Please try again.',
              confirmButtonColor: '#51a992', // Your main color
            });
          }
        );
      }
    });
  }
  
}

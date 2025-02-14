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

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.fetchBanners();
  }

  fetchBanners(): void { 
    this.bannerService.getBanners().subscribe(
      (response: any) => {
        this.banners = response.banners.map((banner: any) => ({
          ...banner,
          image_url: `${banner.image_url}`
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
          title: newStatus === 1 ? '¡Activado!' : '¡Desactivado!',
          text: `El banner ha sido ${newStatus === 1 ? 'activado' : 'desactivado'} exitosamente.`,
          confirmButtonColor: '#51a992', // Your main color
        });
      },
      (error) => {
        console.error('Error toggling banner status:', error);
  
        // SweetAlert for error message
        Swal.fire({
          icon: 'error',
          title: '¡Ups!',
          text: 'Hubo un error al cambiar el estado del banner. Por favor, inténtelo de nuevo.',
          confirmButtonColor: '#51a992', // Your main color
        });
      }
    );
  }

  deleteBanner(banner: any): void {
    // Show confirmation dialog before deleting
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#51a992', // Your main color
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Call deleteBanner service
        this.bannerService.deleteBanner(banner.id).subscribe(
          (res: any) => {
            // Show success message
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'El banner ha sido eliminado exitosamente.',
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
              title: '¡Ups!',
              text: 'Hubo un error al eliminar el banner. Por favor, inténtelo de nuevo.',
              confirmButtonColor: '#51a992', // Your main color
            });
          }
        );
      }
    });
  }
}

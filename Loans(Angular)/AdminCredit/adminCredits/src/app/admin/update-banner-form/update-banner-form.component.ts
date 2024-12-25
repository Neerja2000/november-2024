import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BannerService } from 'src/app/shared/banner/banner.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-update-banner-form',
  templateUrl: './update-banner-form.component.html',
  styleUrls: ['./update-banner-form.component.css']
})
export class UpdateBannerFormComponent implements OnInit {
  bannerForm = new FormGroup({
    content: new FormControl('', [Validators.required]),
    image: new FormControl(null, []),
  });
  bannerId: number = 0;
  
  constructor(
    private bannerService: BannerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.bannerId = +this.route.snapshot.paramMap.get('id')!; // Get banner ID from route
    this.fetchBannerDetails();
  }

  fetchBannerDetails(): void {
    this.bannerService.getBannerById(this.bannerId).subscribe({
      next: (response: any) => {
        const banner = response.banner;

        // Populate the form with fetched details
        this.bannerForm.patchValue({
          content: banner.content,
        });



        console.log('Fetched Banner Details:', banner);
      },
      error: (error) => {
        console.error('Error fetching banner details:', error);
      },
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.bannerForm.patchValue({ image: file });
  }

  bannersave(): void {
    if (this.bannerForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all required fields!',
        confirmButtonColor: '#51a992',
      });
      return;
    }

    const formData = new FormData();
    formData.append('content', this.bannerForm.value.content!);

    if (this.bannerForm.value.image) {
      formData.append('image', this.bannerForm.value.image);
    }

    this.bannerService.updateBanner(this.bannerId, formData).subscribe({
      next: (response) => {
        console.log('Banner updated successfully:', response);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Banner updated successfully!',
          confirmButtonColor: '#51a992',
        });
        this.fetchBannerDetails();
      },
      
      error: (error) => {
        console.error('Error updating banner:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to update banner.',
          confirmButtonColor: '#51a992',
        });
      },
    });
  }
}

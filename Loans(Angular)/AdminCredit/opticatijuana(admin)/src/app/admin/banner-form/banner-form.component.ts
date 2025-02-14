import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BannerService } from 'src/app/shared/banner/banner.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css']
})
export class BannerFormComponent implements OnInit {
  bannerForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    image: new FormControl(null),
  });

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {}

  bannersave(): void {
    const formData = new FormData();
    formData.append('title', this.bannerForm.value.title!);
    formData.append('content', this.bannerForm.value.content!);
    if (this.bannerForm.value.image) {
      formData.append('image', this.bannerForm.value.image);
    }

    this.bannerService.addBanner(formData).subscribe({
      next: (response) => {
        console.log('Banner added successfully:', response);
        // Show SweetAlert2 success message
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: '¡Banner agregado con éxito!',
          confirmButtonColor: '#51a992', // Your main color
        });
      },
      error: (error) => {
        console.error('Error adding banner:', error);
  
        // Extract the specific error message from the backend
        const errorMessage = error.error?.error || error.error?.message || 'Error al agregar el banner.';
  
        // Show SweetAlert2 error message
        Swal.fire({
          icon: 'error',
          title: '¡Fallido!',
          text: errorMessage,
          confirmButtonColor: '#51a992', // Your main color
        });
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.bannerForm.patchValue({ image: file });
  }
}

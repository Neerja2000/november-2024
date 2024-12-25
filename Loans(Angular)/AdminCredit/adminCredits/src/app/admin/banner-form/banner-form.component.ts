import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { BannerService } from 'src/app/shared/banner/banner.service';

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css']
})
export class BannerFormComponent implements OnInit {
  bannerForm = new FormGroup({
    description: new FormControl('', [Validators.required]),
    image: new FormControl(null, [Validators.required]),
  });

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {}

  bannersave(): void {
    if (this.bannerForm.invalid) {
      alert('Please fill all required fields!');
      return;
    }

    const formData = new FormData();
    formData.append('content', this.bannerForm.value.description!);
    if (this.bannerForm.value.image) {
      formData.append('image', this.bannerForm.value.image);
    }

    this.bannerService.addBanner(formData).subscribe({
      next: (response) => {
        console.log('Banner added successfully:', response);
        alert('Banner added successfully!');
        this.bannerForm.reset();
      },
      error: (error) => {
        console.error('Error adding banner:', error);
        alert('Failed to add banner.');
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.bannerForm.patchValue({ image: file });
  }
}

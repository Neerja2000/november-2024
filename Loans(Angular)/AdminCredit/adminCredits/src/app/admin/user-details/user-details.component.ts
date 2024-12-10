import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/users/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  users: any[] = [];
  
  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getUserApplications();
  }
  isImage(fileUrl: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = this.getFileExtension(fileUrl);
    return imageExtensions.includes(extension);
  }
  
  isPDF(fileUrl: string): boolean {
    return this.getFileExtension(fileUrl) === 'pdf';
  }
  
  isZIP(fileUrl: string): boolean {
    const zipExtensions = ['zip', 'rar', '7z'];
    return zipExtensions.includes(this.getFileExtension(fileUrl));
  }
  
  getFileExtension(fileUrl: string): string {
    return fileUrl.split('.').pop()?.toLowerCase() || '';
  }
  
  getUserApplications() {
    this.userService.userApplications().subscribe(
      (res: any) => {
        // Filter users whose status is "Approved" and map the identity_proof URL
        this.users = res
          .filter((user: any) => user.status === 'Approved')
          .map((user: any) => ({
            ...user,
            identity_proof: `http://194.238.17.235:7700/${user.identity_proof}`
          }));
        console.log('Approved Users:', this.users);
      },
      (err: any) => {
        console.error('Error fetching user applications:', err);
      }
    );
  }
}

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
  searchTerm: string = '';

  // Method to filter users based on searchTerm
  filteredUsers() {
    if (!this.searchTerm) {
      return this.users;
    }

    const term = this.searchTerm.toLowerCase();
    return this.users.filter(application => 
      application.full_name.toLowerCase().includes(term) || 
      application.contact_details.includes(term)
    );
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
            identity_proof: `https://api-docs.opticatijuana.com/${user.identity_proof}`,
            proof_of_residence: `https://api-docs.opticatijuana.com/${user.proof_of_residence}`,
            proof_of_income: `https://api-docs.opticatijuana.com/${user.proof_of_income}`
          }));
        console.log('Approved Users:', this.users);
      },
      (err: any) => {
        console.error('Error fetching user applications:', err);
      }
    );
  }
}

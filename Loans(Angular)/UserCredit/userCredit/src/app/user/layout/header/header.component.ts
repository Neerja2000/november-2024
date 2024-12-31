import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // Define the isLoggedIn property
  isCreditApplied: boolean = false;
  constructor(private authService: AuthService,private userLoginService: UserLoginService) {}

  ngOnInit(): void {
    // Check if the user is logged in
    this.isLoggedIn = !!this.authService.getToken(); // Convert token presence to a boolean
    this.fetchCreditApplications();
  }

  logout(): void {
    this.authService.removedata(); // Clear token
    this.isLoggedIn = false; // Update isLoggedIn status
    console.log('User logged out');
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
}

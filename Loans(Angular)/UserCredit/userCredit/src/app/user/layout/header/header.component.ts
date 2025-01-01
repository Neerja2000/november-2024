import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isCreditApplied: boolean = false;

  constructor(
    private authService: AuthService,
    private userLoginService: UserLoginService
  ) {}

  ngOnInit(): void {
    // Check if the user is logged in
    this.isLoggedIn = !!this.authService.getToken();
    
    // Fetch credit applications only if logged in
    if (this.isLoggedIn) {
      this.fetchCreditApplications();
    }
  }

  logout(): void {
    this.authService.removedata(); // Clear token
    this.isLoggedIn = false; // Update isLoggedIn status
    console.log('User logged out');
  }

  fetchCreditApplications(): void {
    this.userLoginService.getCreditApplications().subscribe({
      next: (data) => {
        this.isCreditApplied = !!(data.creditApplications && data.creditApplications.length > 0);
      },
      error: (err) => {
        console.error('Error fetching credit applications:', err);
        this.isCreditApplied = false; // Fallback to false in case of error
      }
    });
  }
}

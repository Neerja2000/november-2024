import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false; // Define the isLoggedIn property

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Check if the user is logged in
    this.isLoggedIn = !!this.authService.getToken(); // Convert token presence to a boolean
  }

  logout(): void {
    this.authService.removedata(); // Clear token
    this.isLoggedIn = false; // Update isLoggedIn status
    console.log('User logged out');
  }
}

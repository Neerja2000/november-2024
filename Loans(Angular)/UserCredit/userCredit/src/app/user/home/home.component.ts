import { Component, OnInit } from '@angular/core';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isCreditApplied: boolean = false; // Flag to track if credit has been applied

  constructor(private userLoginService: UserLoginService) {}

  ngOnInit(): void {
    this.fetchCreditApplications();
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

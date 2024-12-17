import { Component, OnInit } from '@angular/core';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';

@Component({
  selector: 'app-all-details',
  templateUrl: './all-details.component.html',
  styleUrls: ['./all-details.component.css']
})
export class AllDetailsComponent implements OnInit {
  creditApplications: any[] = []; // Store credit applications
  creditStatus: any = {}; // Store credit status details
  transactions: any[] = []; // Store transactions

  constructor(private userLoginService: UserLoginService) {}

  ngOnInit(): void {
    this.fetchCreditDetails();
  }

  fetchCreditDetails(): void {
    this.userLoginService.getCreditApplications().subscribe({
      next: (data) => {
        this.creditApplications = data.creditApplications || [];
        this.creditStatus = data.creditStatus || {};
        this.transactions = this.creditStatus.transactions || [];
      },
      error: (err) => {
        console.error('Error fetching credit details:', err);
      },
    });
  }
}

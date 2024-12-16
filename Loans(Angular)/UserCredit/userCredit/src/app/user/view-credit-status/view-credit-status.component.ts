import { Component, OnInit } from '@angular/core';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';


@Component({
  selector: 'app-view-credit-status',
  templateUrl: './view-credit-status.component.html',
  styleUrls: ['./view-credit-status.component.css']
})
export class ViewCreditStatusComponent implements OnInit {
  creditApplications: any[] = []; // Store API response

  constructor(private userLoginService:UserLoginService) {}

  ngOnInit(): void {
    this.fetchCreditApplications();
  }

  fetchCreditApplications(): void {
    this.userLoginService.getCreditApplications().subscribe({
      next: (data) => {
        this.creditApplications = data.creditApplications || []; // Assuming 'creditApplications' is part of response
      },
      error: (err) => {
        console.error('Error fetching credit applications:', err);
      }
    });
  }
}

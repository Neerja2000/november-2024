import { Component, OnInit } from '@angular/core';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';

@Component({
  selector: 'app-view-credit-status',
  templateUrl: './view-credit-status.component.html',
  styleUrls: ['./view-credit-status.component.css']
})
export class ViewCreditStatusComponent implements OnInit {
  creditApplications: any[] = []; // Store API response

  constructor(private userLoginService: UserLoginService) {}

  ngOnInit(): void {
    this.fetchCreditApplications();
  }

  fetchCreditApplications(): void {
    this.userLoginService.getCreditApplications().subscribe({
      next: (data) => {
        this.creditApplications = data.creditApplications.map((application: any) => ({
          ...application,
          identity_proof: `https://api-docs.opticatijuana.com/${application.identity_proof}`,
        }));
        console.log(this.creditApplications)
      },
      error: (err) => {
        console.error('Error fetching credit applications:', err);
      },
    });
  }

  
  // Check if there are any approved applications
  hasApprovedApplications(): boolean {
    return this.creditApplications.some(app => app.status === 'Approved');
  }

  // Check if there are any applications requiring review
  hasReviewRequiredApplications(): boolean {
    return this.creditApplications.some(app => app.status === 'Review Required');
  }
  hasRejectedApplications():boolean{
    return this.creditApplications.some(app => app.status === 'Rejected');
  }
}

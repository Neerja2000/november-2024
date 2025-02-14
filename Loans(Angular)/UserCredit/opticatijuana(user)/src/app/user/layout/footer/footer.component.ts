import { Component, OnInit } from '@angular/core';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
 // Define the isLoggedIn property
  isCreditApplied: boolean = false;
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

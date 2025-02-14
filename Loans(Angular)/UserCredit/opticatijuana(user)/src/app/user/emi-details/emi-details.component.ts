import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserLoginService } from 'src/app/shared/userLogin/user-login.service';

@Component({
  selector: 'app-emi-details',
  templateUrl: './emi-details.component.html',
  styleUrls: ['./emi-details.component.css']
})
export class EmiDetailsComponent implements OnInit {
  emiDetails: any[] = []; // Store EMI details
  transactionId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private userLoginService: UserLoginService
  ) {}

  ngOnInit(): void {
    // Get transaction ID from route params
    this.transactionId = Number(this.route.snapshot.paramMap.get('transactionId'));
    console.log(this.transactionId)

    // Fetch EMI details
    this.fetchEmiDetails();
  }

  fetchEmiDetails(): void {
    this.userLoginService.getCreditApplications().subscribe({
      next: (data) => {
     
  
        // Find transaction with the matching transactionId
        const transaction = data.creditStatus.transactions.find(
          (t: any) => t.transactionId === this.transactionId
        );
  
  
        if (transaction && transaction.emis && transaction.emis.length > 0) {
          this.emiDetails = transaction.emis; // Assign EMI details
          console.log('EMI Details:', this.emiDetails); // Debugging: Check EMI details
        } else {
          console.warn('No EMI details found for the given transaction ID');
        }
      },
      error: (err) => {
        console.error('Error fetching EMI details:', err);
      },
    });
  }
  

  calculateTotalAmount(emi: any): number {
    const principalAmount = emi.principalAmount || 0;
    const interestAmount = emi.interestAmount || 0;
    return principalAmount + interestAmount;
  }

 
  

  calculateTotalremaining(emi: any): number {
    const remainingPrincipal = emi.remainingPrincipal || 0;
    const remainingInterest = emi.remainingInterest || 0;
    console.log("remaining",remainingPrincipal + remainingInterest)
    return remainingPrincipal + remainingInterest;
   
  }
}
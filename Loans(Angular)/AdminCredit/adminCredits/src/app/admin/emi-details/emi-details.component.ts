import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/shared/users/users.service';

@Component({
  selector: 'app-emi-details',
  templateUrl: './emi-details.component.html',
  styleUrls: ['./emi-details.component.css']
})
export class EmiDetailsComponent implements OnInit {
  userId: string = '';
  transactionId: string = '';
  emiDetails: any = [];

  constructor(
    private route: ActivatedRoute,  // ActivatedRoute to fetch route params
    private emiService: UsersService   // Service to fetch EMI details
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];  // Get userId from URL
      this.transactionId = params['transactionId'];  // Get transactionId from URL
      console.log('Transaction ID from URL:', this.transactionId);  // Log to verify
      this.fetchEmiDetails();
    });
    
  }

  fetchEmiDetails(): void {
    if (!this.userId || !this.transactionId) {
      console.error('User ID or Transaction ID is missing!');
      return;
    }
  
    this.emiService.getCreditStatus(this.userId).subscribe(
      (response: any) => {
        console.log('Full response:', response);  // Log the response to inspect the structure
        if (response && response.transactions) {
          // Find the specific transaction by matching the transactionId
          const transaction = response.transactions.find((tx: any) => tx.transactionId === Number(this.transactionId));
          console.log('Found transaction:', transaction);  // Log the found transaction
  
          if (transaction && transaction.emis) {
            this.emiDetails = transaction.emis;
            console.log('EMIs:', this.emiDetails);  // Log the EMIs if found
          } else {
            console.error('No EMIs found for this transaction');
          }
        } else {
          console.error('No transactions found');
        }
      },
      (error) => {
        console.error('Error fetching EMI details:', error);
      }
    );
  }
  
  
}

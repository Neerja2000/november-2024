import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/shared/transaction/transaction.service';
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
  selectedEmi: any = null;

  emiForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private emiService: UsersService,
    private fb: FormBuilder,
    private transactionService:TransactionService
  ) {
    this.emiForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
      this.transactionId = params['transactionId'];
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
        if (response && response.transactions) {
          const transaction = response.transactions.find((tx: any) => tx.transactionId === Number(this.transactionId));
          this.emiDetails = transaction?.emis || [];
        }
      },
      (error) => console.error('Error fetching EMI details:', error)
    );
  }

  openSettleModal(emi: any): void {
    this.selectedEmi = emi;
    this.emiForm.patchValue({ amount: emi.amount });
  }

  settleEMI(): void {
    if (this.emiForm.invalid || !this.selectedEmi) {
      console.error('Form is invalid or no EMI selected!');
      return;
    }

    const body = {
      emiId: this.selectedEmi.emiId,
      amount: this.emiForm.value.amount,
    };

    this.transactionService.emiSettle(body).subscribe(
      (response) => {
        console.log('EMI settled successfully:', response);
        this.fetchEmiDetails(); // Refresh EMI list
      },
      (error) => console.error('Error settling EMI:', error)
    );
  }
}

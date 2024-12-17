import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  @ViewChild('openSettleModal') openSettleModalRef!: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private emiService: UsersService,
    private fb: FormBuilder,
    private transactionService:TransactionService, private renderer: Renderer2
  ) {
    this.emiForm = this.fb.group({
      principalAmount: ['', [Validators.required, Validators.min(1)]],
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
    this.emiForm.patchValue({ principalAmount: emi.principalAmount });  // Corrected the key to match the formControlName
  }
  

  settleEMI(): void {
    if (this.emiForm.invalid || !this.selectedEmi) {
      console.error('Form is invalid or no EMI selected!');
      return;
    }
  
    const body = {
      emiId: this.selectedEmi.emiId,
      amount: this.emiForm.value.principalAmount,
    };
  
    this.transactionService.emiSettle(body).subscribe(
      (response) => {
        console.log('EMI settled successfully:', response);
  
        // Update local data (just set it as settled without showing "Amount Fully Settled")
        const emiIndex = this.emiDetails.findIndex((emi: any) => emi.emiId === this.selectedEmi.emiId);
        if (emiIndex > -1) {
          this.emiDetails[emiIndex].isSettled = true;
          this.emiDetails[emiIndex].settled = this.emiForm.value.principalAmount;  // Optionally update settled amount if needed
        }
  
        // Close modal using Renderer2
        const modalElement = this.openSettleModalRef.nativeElement;
        this.renderer.setAttribute(modalElement, 'style', 'display: none');
        modalElement.classList.remove('show');
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      },
      (error) => console.error('Error settling EMI:', error)
    );
  }
  
  
}



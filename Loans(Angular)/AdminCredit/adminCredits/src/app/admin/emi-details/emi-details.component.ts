import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/shared/transaction/transaction.service';
import { UsersService } from 'src/app/shared/users/users.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-emi-details',
  templateUrl: './emi-details.component.html',
  styleUrls: ['./emi-details.component.css'],
})
export class EmiDetailsComponent implements OnInit {
  userId: string = '';
  transactionId: string = '';
  emiDetails: any[] = [];
  selectedEmi: any = null;
  users: any[] = [];
  transaction:any[]=[]
  emiForm: FormGroup;

  @ViewChild('openSettleModal') openSettleModalRef!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private emiService: UsersService,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private renderer: Renderer2
  ) {
    this.emiForm = this.fb.group({
      principalAmount: [0, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
      this.transactionId = params['transactionId'];
      this.fetchEmiDetails();
      this.fetchUsers()
      this.fetchtransaction()
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
          const transaction = response.transactions.find(
            (tx: any) => tx.transactionId === Number(this.transactionId)
          );
          console.log('Fetched Transaction:', transaction);
          console.log('EMI Details Array:', this.emiDetails);
          
          this.emiDetails = transaction?.emis || [];
  
          // Validate if remainingBalance and totalInterest are available
          console.log('EMI Details Array:', this.emiDetails);
        }
      },
      (error: any) => console.error('Error fetching EMI details:', error)
    );
  }
  

  openSettleModal(emi: any): void {
    this.selectedEmi = emi;
    const totalAmount = Number(
      (emi.principalAmount + emi.interestAmount).toFixed(2)
    );
    this.emiForm.patchValue({ principalAmount: totalAmount });
  }

  settleEMI(): void {
    if (this.emiForm.invalid || !this.selectedEmi) {
      console.error('Form is invalid or no EMI selected!');
      return;
    }
  
    const totalAmount = (
      this.selectedEmi.principalAmount + this.selectedEmi.interestAmount
    ).toFixed(2);
  
    if (this.emiForm.value.principalAmount > totalAmount) {
      console.error('Settlement amount exceeds the remaining balance!');
      return;
    }
  
    const body = {
      emiId: this.selectedEmi.emiId,
      amount: this.emiForm.value.principalAmount,
    };
  
    this.transactionService.emiSettle(body).subscribe(
      (response) => {
        console.log('EMI settled successfully:', response);
  
        // Find the settled EMI and update its state
        const emiIndex = this.emiDetails.findIndex(
          (emi: any) => emi.emiId === this.selectedEmi.emiId
        );
        if (emiIndex > -1) {
          this.emiDetails[emiIndex].isSettled = true;
          this.emiDetails[emiIndex].settled = totalAmount;
          this.emiDetails[emiIndex].remainingInterest = 0;  // Update remainingInterest
          this.emiDetails[emiIndex].remainingPrincipal = 0;  // Update remainingPrincipal
        }
  
        // Close the modal
        const modalElement = this.openSettleModalRef.nativeElement;
        this.renderer.setAttribute(modalElement, 'style', 'display: none');
        modalElement.classList.remove('show');
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
  
        // Re-fetch EMI details to ensure the UI is updated after settlement
        this.fetchEmiDetails();
      },
      (error: any) => console.error('Error settling EMI:', error)
    );
  }
  

  fetchUsers(): void {
    this.emiService.userApplications().subscribe(
      (response: any) => {
        console.log("Full response from API:", response);
        console.log("UserId to match:", this.userId);
        console.log("First object in response:", response[0]);
  
        // Log all user_ids to confirm matching field
        const allUserIds = response.map((user: any) => user.user_id);
        console.log("All User IDs in response:", allUserIds);
  
        // Filter users based on user_id
        this.users = response.filter((user: any) => +user.user_id === +this.userId);
        console.log("Filtered user:", this.users);
      },
      (error) => {
        console.error('Error fetching users:', error.message);
      }
    );
  }
  fetchtransaction(): void {
    if (!this.userId) {
      console.error('User ID is missing!');
      return;
    }
  
    this.emiService.getCreditStatus(this.userId).subscribe(
      (response: any) => {
        this.transaction = response.transactions.filter(
          (transaction: any) => +transaction.transactionId === +this.transactionId
        );
        console.log('transactions', this.transaction);
      },
      (error: any) => {
        console.error('Error fetching transaction details:', error);
      }
    );
  }
  
  exportToExcel(): void {
    console.log('Users array:', this.users);
    console.log('EMI Details array:', this.emiDetails);
    console.log('Transaction:', this.transaction);
  
    if (this.users.length > 0 || this.emiDetails.length > 0 || this.transaction) {
      // User worksheet data
      const userWorksheetData = this.users.map((user: any, index: number) => ({
        'Sr No.': index + 1,
        Name: user.full_name,
        'Employer Name': user.employer_name,
        'Phone No.': user.contact_details,
        'Monthly Income': user.monthly_income,
        Employment_Type: user.employment_type,
        'Identity Proof': user.identity_proof,
      }));
  

      const transactionWorksheetData = this.transaction && this.transaction.length > 0
      ? this.transaction.map((transaction: any) => ({
          'Transaction ID': transaction.transactionId,
          'Principal Amount': transaction.principalAmount,
          'Remaining Balance': transaction.remainingBalance,
          'Total Interest': transaction.totalInterest,
      }))
      : [];
   
      // EMI worksheet data
      const emiWorksheetData = this.emiDetails.map((emi: any) => ({
        'EMI ID': emi.emiId,
        'EMI Amount': emi.principalAmount,
        'EMI Interest': emi.interestAmount,
        'Due Date': new Date(emi.dueDate).toLocaleDateString('en-CA'), // 'yyyy-MM-dd' format
        'Settled Amount': emi.settled
          ? (emi.principalAmount + (emi.interestAmount || 0)).toFixed(2)
          : 'Not Settled',
      }));
      
  
   
  
      // Create workbook and append sheets
      const workbook = XLSX.utils.book_new();
  
      if (userWorksheetData.length > 0) {
        const userWorksheet = XLSX.utils.json_to_sheet(userWorksheetData);
        XLSX.utils.book_append_sheet(workbook, userWorksheet, 'User Details');
      }
      if (transactionWorksheetData.length > 0) {
        const transactionWorksheet = XLSX.utils.json_to_sheet(transactionWorksheetData);
        XLSX.utils.book_append_sheet(workbook, transactionWorksheet, 'Transaction Details');
      }
      if (emiWorksheetData.length > 0) {
        const emiWorksheet = XLSX.utils.json_to_sheet(emiWorksheetData);
        XLSX.utils.book_append_sheet(workbook, emiWorksheet, 'EMI Details');
      }
  
    
  
      // Write and save the workbook
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
  
      const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
  
      saveAs(
        blob,
        `EMI_Details_${new Date().toISOString().replace(/:/g, '-')}.xlsx`
      );
    } else {
      console.log('No users, transactions, or EMI details to export');
    }
  }
  
  
}

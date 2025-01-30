import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/shared/dashboad/dashboard.service';
import { TransactionService } from 'src/app/shared/transaction/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  emisList: any[] = [];
  futureUnsettledEmis: any[] = [];
  pastUnsettledEmis: any[] = [];
  today: string;
  emiDetails: any[] = [];
  selectedEmi: any | null = null;
  emiForm: FormGroup;
  dashboardData: any = {};

  constructor(
    private dashboardService: DashboardService,
    private transactionService: TransactionService,
    private fb: FormBuilder
  ) {
    this.today = new Date().toISOString().split('T')[0];
    this.emiForm = this.fb.group({
      principalAmount: ['', [Validators.required, Validators.min(0)]],
      receivingDate: [this.today, Validators.required],
      additionalremarks: [''],
    });
  }

  ngOnInit(): void {
    this.getDashboard();
    this.getAllEmis();
  }

  getAllEmis(): void {
    this.dashboardService.getAllEmis().subscribe(
      (data: any[]) => {
        const currentDate = new Date();

        this.emisList = data.filter((emi) => emi.settled === 1).map((emi) => ({
          ...emi,
          emi_with_interest: emi.principal_amount + emi.interest_amount,
        }));

        this.futureUnsettledEmis = data.filter(
          (emi) => emi.settled === 0 && new Date(emi.due_date) >= currentDate
        ).map((emi) => ({
          ...emi,
          emi_with_interest: emi.principal_amount + emi.interest_amount,
        }));

        this.pastUnsettledEmis = data.filter(
          (emi) => emi.settled === 0 && new Date(emi.due_date) < currentDate
        ).map((emi) => ({
          ...emi,
          emi_with_interest: emi.principal_amount + emi.interest_amount,
        }));
      },
      (error) => {
        console.error('Error fetching EMIs:', error);
      }
    );
  }

  openSettleModal(emi: any): void {
    this.selectedEmi = emi;
    console.log(this.selectedEmi);  // Check if emiId exists here
    const totalAmount = Number((emi.principal_amount + emi.interest_amount).toFixed(2));
    this.emiForm.patchValue({
      principalAmount: totalAmount,
      receivingDate: emi.receivingDate || this.today,
      additionalremarks: emi.additionalremarks || '',
    });
  }
  
  initialRows = 10;

// Rows to show for each tab
rowsToShowUpcoming = this.initialRows;
rowsToShowPending = this.initialRows;
rowsToShowSettled = this.initialRows;
rowsToShowAll = this.initialRows;

showMore(tab: string): void {
  if (tab === 'upcoming') this.rowsToShowUpcoming += 10;
  else if (tab === 'pending') this.rowsToShowPending += 10;
  else if (tab === 'settled') this.rowsToShowSettled += 10;
  else if (tab === 'all') this.rowsToShowAll += 10;
}

showLess(tab: string): void {
  if (tab === 'upcoming') this.rowsToShowUpcoming -= 10;
  else if (tab === 'pending') this.rowsToShowPending -= 10;
  else if (tab === 'settled') this.rowsToShowSettled -= 10;
  else if (tab === 'all') this.rowsToShowAll -= 10;
}


 

settleEMI(): void {
  if (this.emiForm.invalid || !this.selectedEmi) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Input',
      text: 'Please fill in all required fields and select a valid EMI!',
    });
    return;
  }

  const body = {
    emiId: this.selectedEmi.emi_id,
    amount: this.emiForm.value.principalAmount,
    receivingDate: this.emiForm.value.receivingDate,
    additionalremarks: this.emiForm.value.additionalremarks,
  };

  this.transactionService.emiSettle(body).subscribe(
    (response) => {
      console.log('EMI settled successfully:', response);

      // Update EMI details in the table
      const emiIndex = this.emiDetails.findIndex(
        (emi: any) => emi.emiId === this.selectedEmi.emiId
      );
      if (emiIndex > -1) {
        this.emiDetails[emiIndex].isSettled = true;
        this.emiDetails[emiIndex].settled = body.amount;
        this.emiDetails[emiIndex].receivingDate = body.receivingDate;
        this.emiDetails[emiIndex].additionalremarks = body.additionalremarks;
      }

      this.getAllEmis();

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'EMI Settled',
        text: `EMI for ${this.selectedEmi.name} has been settled successfully.`,
      });
    },
    (error: any) => {
      console.error('Error settling EMI:', error);

      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while settling the EMI. Please try again later.',
      });
    }
  );
}



getDashboard() {
  this.dashboardService.getAllDashboard().subscribe(
    (res: any) => {
      this.dashboardData = res; // Assign response to variable
      console.log('Dashboard Data:', this.dashboardData);
    },
    (err) => {
      console.error('Error fetching dashboard data:', err);
    }
  );
}

}

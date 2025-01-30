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
    const totalAmount = Number((emi.principal_amount + emi.interest_amount).toFixed(2));
    this.emiForm.patchValue({
      principalAmount: totalAmount,
      receivingDate: emi.receivingDate || this.today,
      additionalremarks: emi.additionalremarks || '',
    });
  }

  initialRows = 10;

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
        title: 'Entrada inválida',
        text: '¡Por favor complete todos los campos obligatorios y seleccione un EMI válido!',
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

        Swal.fire({
          icon: 'success',
          title: 'EMI Liquidado',
          text: `El EMI para ${this.selectedEmi.name} se ha liquidado con éxito.`,
        });
      },
      (error: any) => {
        console.error('Error settling EMI:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Se produjo un error al liquidar el EMI. Por favor, inténtelo de nuevo más tarde.',
        });
      }
    );
  }

  getDashboard() {
    this.dashboardService.getAllDashboard().subscribe(
      (res: any) => {
        this.dashboardData = res;
        console.log('Datos del Dashboard:', this.dashboardData);
      },
      (err) => {
        console.error('Error fetching dashboard data:', err);
      }
    );
  }
}

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
      receivingDate: [''], // Default value
      additionalremarks: [''],
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
    this.emiForm.patchValue({
      principalAmount: totalAmount,
      receivingDate: emi.receivingDate || new Date().toISOString().split('T')[0],
      additionalremarks: emi.additionalremarks || '',
    });
  }
  

  settleEMI(): void {
    if (this.emiForm.invalid || !this.selectedEmi) {
      console.error('Form is invalid or no EMI selected!');
      return;
    }
  
    const body = {
      emiId: this.selectedEmi.emiId,
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
        'No. Sr.': index + 1,
        Nombre: user.full_name,
        'Nombre del Empleador': user.employer_name,
        'No. de Teléfono': user.contact_details,
        'Ingresos Mensuales': user.monthly_income,
        'Tipo de Empleo': user.employment_type,
        'Prueba de Identidad': user.identity_proof,
      }));
  
      // Transaction worksheet data
      const transactionWorksheetData =
        this.transaction && this.transaction.length > 0
          ? this.transaction.map((transaction: any) => ({
              'ID de Transacción': transaction.transactionId,
              'Monto Principal': transaction.principalAmount,
              'Saldo Restante': transaction.remainingBalance,
              'Interés Total': transaction.totalInterest,
            }))
          : [];
  
      // EMI worksheet data
      const emiWorksheetData = this.emiDetails.map((emi: any) => ({
        'ID de EMI': emi.emiId,
        'Monto de EMI': emi.principalAmount,
        'Interés de EMI': emi.interestAmount,
        'Fecha de Vencimiento': new Date(emi.dueDate).toLocaleDateString('en-CA'), // 'yyyy-MM-dd' format
        'Monto Liquidado': emi.settled
          ? (emi.principalAmount + (emi.interestAmount || 0)).toFixed(2)
          : 'No Liquidado',
        'Fecha de Recepción': emi.receivingDate || 'N/A', // Include receiving date
        'Comentarios Adicionales': emi.additionalremarks || 'N/A', // Include additional remarks
      }));
  
      // Create workbook and append sheets
      const workbook = XLSX.utils.book_new();
  
      if (userWorksheetData.length > 0) {
        const userWorksheet = XLSX.utils.json_to_sheet(userWorksheetData);
        XLSX.utils.book_append_sheet(workbook, userWorksheet, 'Detalles de Usuario');
      }
      if (transactionWorksheetData.length > 0) {
        const transactionWorksheet = XLSX.utils.json_to_sheet(transactionWorksheetData);
        XLSX.utils.book_append_sheet(workbook, transactionWorksheet, 'Detalles de Transacción');
      }
      if (emiWorksheetData.length > 0) {
        const emiWorksheet = XLSX.utils.json_to_sheet(emiWorksheetData);
        XLSX.utils.book_append_sheet(workbook, emiWorksheet, 'Detalles de EMI');
      }
  
      // Write and save the workbook
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
  
      const blob = new Blob([excelBuffer], {
        type: 'application/octet-stream',
      });
  
      saveAs(blob, `Detalles_EMI_${new Date().toISOString().replace(/:/g, '-')}.xlsx`);
    } else {
      console.log('No hay usuarios, transacciones o detalles de EMI para exportar');
    }
  }
  
  
  
}

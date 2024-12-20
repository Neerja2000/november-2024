import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/shared/transaction/transaction.service';
import { UsersService } from 'src/app/shared/users/users.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-user-details',
  templateUrl: './view-user-details.component.html',
  styleUrls: ['./view-user-details.component.css'],
})
export class ViewUserDetailsComponent implements OnInit {
  userId: number = 0; // Default value
  transactionForm: FormGroup;
  creditStatus: any = {
    creditLimit: 0,
    creditUsed: 0,
    availableCredit: 0,
  };
  users: any[] = [];
  transactions: any[] = [];
  updateCreditForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private transactionService: TransactionService, private userService: UsersService
  ) {
    // Initialize form
    this.transactionForm = this.fb.group({
      amount: ['', Validators.required],
      dueDate: ['', Validators.required],
      remark: [''],
      emiDetails: this.fb.group({
        Emis: [0, Validators.required],
        interest: [0, Validators.required],
      }),
    });
    this.updateCreditForm = this.fb.group({
      creditLimit: [null, [Validators.required, Validators.min(1)]],
    });

  }

  ngOnInit(): void {
    // Fetch `userId` from route params
    this.route.params.subscribe((params: any) => {
      this.userId = +params['userId'] || 0; // Default to 0 if no `userId` provided
      console.log('Fetched userId:', this.userId);
      this.fetchCreditStatus();
      this.fetchUsers();
    });
  }

  fetchCreditStatus(): void {
    this.userService.getCreditStatus(this.userId.toString()).subscribe(
      (status: any) => {
        this.creditStatus = {
          creditLimit: status.creditLimit || 0,
          creditUsed: status.creditUsed || 0,
          availableCredit: status.availableCredit || 0
        };
        this.transactions = status.transactions || [];

        console.log('Fetched Credit Status:', this.creditStatus);
        console.log('Fetched Transactions:', this.transactions);
      },
      (err) => {
        console.error('Error fetching credit status:', err.message, err);
      }
    );
  }

  addTransaction(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const transactionData = {
        amount: formValue.amount,
        dueDate: formValue.dueDate,
        remark: formValue.remark || '',
        emiDetails: {
          numberOfEmis: formValue.emiDetails.Emis || 0,
          annualInterestRate: formValue.emiDetails.interest || 0,
        },
        userId: this.userId,
      };

      console.log('Transaction data to be sent:', transactionData);

      this.transactionService.transactionAdd(transactionData).subscribe(
        (response: any) => {
          console.log('Transaction added successfully:', response);

          // Success alert using SweetAlert2
          Swal.fire({
            title: '¡Éxito!',
            text: '¡Transacción agregada con éxito!',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          this.transactionForm.reset();
          this.fetchCreditStatus();
        },
        (error) => {
          console.error('Error adding transaction:', error.message, error);

          // Error alert using SweetAlert2
          Swal.fire({
            title: '¡Error!',
            text: 'No se pudo agregar la transacción. Por favor, inténtelo nuevamente.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    } else {
      console.error('Transaction form is invalid:', this.transactionForm.errors);

      // Invalid form alert using SweetAlert2
      Swal.fire({
        title: '¡Advertencia!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  viewEMIDetails(emis: any[]): void {
    console.log('Detalles del EMI:', emis);
    // You can implement modal or additional view logic here
  }

  updateCreditLimit(userId: number, creditLimit: number): Promise<void> {
    const body = { userId, creditLimit };
    return new Promise((resolve, reject) => {
      this.userService.creditAdded(body).subscribe(
        (res: any) => {
          console.log('Límite de crédito actualizado con éxito:', res);
          this.fetchCreditStatus();
          resolve();
        },
        (err: any) => {
          console.error('Error al actualizar el límite de crédito:', err);
          reject(err);
        }
      );
    });
  }

  fetchUsers(): void {
    this.userService.userApplications().subscribe(
      (response: any) => {
        this.users = response || []; // Make sure the response is assigned to this.users
        console.log(this.users); // This will now log the users array
      },
      (error) => {
        console.error('Error fetching users:', error.message);
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/shared/transaction/transaction.service';
import { UsersService } from 'src/app/shared/users/users.service';

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

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private transactionService: TransactionService,private userService:UsersService
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
  }

  ngOnInit(): void {
    // Fetch `userId` from route params
    this.route.params.subscribe((params: any) => {
      this.userId = +params['userId'] || 0; // Default to 0 if no `userId` provided
      console.log('Fetched userId:', this.userId);
      this.fetchCreditStatus();
    });
  }

  fetchCreditStatus(): void {
    this.userService.getCreditStatus(this.userId.toString()).subscribe(
      (status: any) => {
        this.creditStatus = {
          creditLimit: status.creditLimit || 0,
          creditUsed: status.creditUsed || 0,
          availableCredit: status.availableCredit || 0,
        };
        console.log('Credit Status fetched successfully:', this.creditStatus);
        console.log(status)



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
          alert('Transaction added successfully!');
          this.transactionForm.reset(); // Reset form after successful submission
        },
        (error) => {
          console.error('Error adding transaction:', error.message, error);
          alert('Failed to add transaction. Please try again.');
        }
      );
    } else {
      console.error('Transaction form is invalid:', this.transactionForm.errors);
      alert('Please fill all required fields.');
    }
  }
  
  
  

  
}



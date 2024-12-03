import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.css']
})
export class NewUsersComponent {
  openModal() {
    Swal.fire({
      title: 'Add Credit',
      html: `
        <input type="number" id="creditAmount" class="swal2-input" placeholder="Enter credit amount" required>
      `,
      confirmButtonText: 'Submit',
      showCancelButton: true,
      cancelButtonText: 'Close',
      preConfirm: () => {
        const creditAmount = (document.getElementById('creditAmount') as HTMLInputElement).value;
        if (!creditAmount) {
          Swal.showValidationMessage('Please enter a credit amount');
        }
        return creditAmount;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const creditAmount = (document.getElementById('creditAmount') as HTMLInputElement).value;
        Swal.fire(`Credit amount: ${creditAmount} added successfully!`);
      }
    });
  }
}

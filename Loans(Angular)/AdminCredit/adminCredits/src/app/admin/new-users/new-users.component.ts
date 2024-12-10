import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/shared/users/users.service';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.css']
})
export class NewUsersComponent implements OnInit {
  userApplications: any[] = [];

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getUserApplications();
  }
  isImage(fileUrl: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = this.getFileExtension(fileUrl);
    return imageExtensions.includes(extension);
  }
  
  isPDF(fileUrl: string): boolean {
    return this.getFileExtension(fileUrl) === 'pdf';
  }
  
  isZIP(fileUrl: string): boolean {
    const zipExtensions = ['zip', 'rar', '7z'];
    return zipExtensions.includes(this.getFileExtension(fileUrl));
  }
  
  getFileExtension(fileUrl: string): string {
    return fileUrl.split('.').pop()?.toLowerCase() || '';
  }
  
  // Fetch user applications
  getUserApplications() {
    this.userService.userApplications().subscribe(
      (res: any) => {
        // Filter and format the applications
        this.userApplications = res
          .filter((application: any) => application.status !== 'Approved') // Exclude 'Approved'
          .map((application: any) => ({
            ...application,
            identity_proof: `http://194.238.17.235:7700/${application.identity_proof}`
          }));

        console.log('User Applications:', this.userApplications);
      },
      (err: any) => {
        console.error('Error fetching user applications:', err);
      }
    );
  }

  // Handle status change
 // Handle status change
statusChanged(applicationId: number, status: string, userId: number) {
  if (status === 'Approved') {
    Swal.fire({
      title: 'Enter Credit Limit',
      input: 'number',
      inputPlaceholder: 'Enter the credit limit',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        const creditLimit = parseFloat(value);
        if (!value) {
          return 'Credit limit is required!';
        }
        if (isNaN(creditLimit) || creditLimit <= 0) {
          return 'Please enter a valid credit limit';
        }
        return undefined; // Valid input
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const creditLimit = parseFloat(result.value);
        // Add credit limit first
        this.updateCreditLimit(userId, creditLimit)
          .then(() => {
            // Then change the status after credit is added
            return this.changeStatus(applicationId, status, '', userId); // No review message for approved
          })
          .then(() => {
            this.getUserApplications(); // Refresh applications
            Swal.fire('Success', 'Credit limit added and status updated!', 'success');
          })
          .catch((error) => {
            console.error('Error in the process:', error);
            Swal.fire('Error', 'Something went wrong!', 'error');
          });
      }
    });
  } else if (status === 'Review Required') {
    // If status is 'Review Required', ask for a review message
    Swal.fire({
      title: 'Enter Review Message',
      input: 'text',
      inputPlaceholder: 'Enter a message for the review',
      showCancelButton: true,
      confirmButtonText: 'Submit Review',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Review message is required!';
        }
        return undefined; // Valid input
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const reviewMessage = result.value;
        // Send the status change request with the review message
        this.changeStatus(applicationId, status, reviewMessage, userId) // Pass reviewMessage here
          .then(() => {
            this.getUserApplications(); // Refresh applications
            Swal.fire('Success', 'Review message added and status updated!', 'success');
          })
          .catch((error) => {
            console.error('Error in the process:', error);
            Swal.fire('Error', 'Something went wrong!', 'error');
          });
      }
    });
  } else {
    // Directly change the status if not 'Approved' or 'Review Required'
    this.changeStatus(applicationId, status, '', userId) // No review message
      .then(() => {
        this.getUserApplications(); // Refresh applications
        Swal.fire('Success', 'Status updated successfully!', 'success');
      })
      .catch((error) => {
        console.error('Error changing status:', error);
        Swal.fire('Error', 'Could not update status!', 'error');
      });
  }
}

// Change application status and handle review message if provided
changeStatus(applicationId: number, status: string, reviewMessage: string = '', userId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const body = {
      applicationId,
      status,
      reviewMessage,  // Include review message if available
      userId
    };

    this.userService.changeStatus(applicationId, status, reviewMessage, userId).subscribe(
      (res: any) => {
        console.log('Status changed successfully:', res);
        resolve();
      },
      (err: any) => {
        console.error('Error changing status:', err);
        reject(err);
      }
    );
  });
}


  // Update credit limit
  updateCreditLimit(userId: number, creditLimit: number): Promise<void> {
    const body = { userId, creditLimit };
    return new Promise((resolve, reject) => {
      this.userService.creditAdded(body).subscribe(
        (res: any) => {
          console.log('Credit limit updated successfully:', res);
          resolve();
        },
        (err: any) => {
          console.error('Error updating credit limit:', err);
          reject(err);
        }
      );
    });
  }
}

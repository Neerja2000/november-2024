import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/shared/users/users.service';

@Component({
  selector: 'app-view-user-details',
  templateUrl: './view-user-details.component.html',
  styleUrls: ['./view-user-details.component.css']
})
export class ViewUserDetailsComponent implements OnInit {
  user: any;

  constructor(private route: ActivatedRoute, private userService: UsersService) {}

  ngOnInit(): void {
    // Get user ID from route
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.getUserDetails(userId);
    }
  }

  getUserDetails(id: string): void {
    // Fetch user applications and find the user with the matching ID
    this.userService.userApplications().subscribe(
      (res: any) => {
        const matchedUser = res.find((user: any) => user.id.toString() === id);
        if (matchedUser) {
          // Prepend the base URL to the identity_proof path
          matchedUser.identity_proof = `http://194.238.17.235:7700/${matchedUser.identity_proof}`;
          this.user = matchedUser;
          console.log('User Details:', this.user);
        } else {
          console.error('User not found with ID:', id);
        }
      },
      (err: any) => {
        console.error('Error fetching user applications:', err);
      }
    );
  }










  table1: { date: string; amount: string }[] = [
    { date: '', amount: '' },
  ];

  table2: { date: string; amount: string }[] = [
    { date: '', amount: '' },
  ];

  addRow(table: string): void {
    if (table === 'table1') {
      this.table1.push({ date: '', amount: '' });
    } else if (table === 'table2') {
      this.table2.push({ date: '', amount: '' });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/users/users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  users: any[] = [];
  
  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getUserApplications();
  }

  getUserApplications() {
    this.userService.userApplications().subscribe(
      (res: any) => {
        // Filter users whose status is "Approved" and map the identity_proof URL
        this.users = res
          .filter((user: any) => user.status === 'Approved')
          .map((user: any) => ({
            ...user,
            identity_proof: `http://194.238.17.235:7700/${user.identity_proof}`
          }));
        console.log('Approved Users:', this.users);
      },
      (err: any) => {
        console.error('Error fetching user applications:', err);
      }
    );
  }
}

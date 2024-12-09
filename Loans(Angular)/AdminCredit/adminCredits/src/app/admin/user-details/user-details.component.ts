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
        // Filter users whose status is "Approved"
        this.users = res.filter((user: any) => user.status === 'Approved');
        console.log('Approved Users:', this.users);
      },
      (err: any) => {
        console.error('Error fetching user applications:', err);
      }
    );
  }
}

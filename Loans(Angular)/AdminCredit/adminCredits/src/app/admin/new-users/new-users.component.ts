import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/shared/users/users.service';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.css']
})
export class NewUsersComponent  implements OnInit {
  userApplications: any[] = [];
constructor(private userService:UsersService){}
ngOnInit(): void {
  this.getUserApplications()
}
getUserApplications() {
  this.userService.userApplications().subscribe(
    (res: any) => {
      this.userApplications = res; // Assign API response to the property
      
      console.log('User Applications:', this.userApplications);
    },
    (err: any) => {
      console.error('Error fetching user applications:', err);
    }
  );
}
}

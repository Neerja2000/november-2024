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
      this.userApplications = res.map((application: any) => ({
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
statusChanged(applicationId: number, status: string) {
  this.userService.changeStatus(applicationId, status).subscribe(
    (res: any) => {
      console.log('Status changed successfully:', res);
      // Optionally, refresh the user applications or show a success message
    },
    (err: any) => {
      console.error('Error changing status:', err);
    }
  );
}
}

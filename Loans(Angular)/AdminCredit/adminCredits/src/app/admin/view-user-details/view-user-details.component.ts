import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/shared/users/users.service';

@Component({
  selector: 'app-view-user-details',
  templateUrl: './view-user-details.component.html',
  styleUrls: ['./view-user-details.component.css']
})
export class ViewUserDetailsComponent implements OnInit {
  creditDetails: any;

  constructor(private route: ActivatedRoute, private userService: UsersService) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId');
  
    if (userId) {
      console.log(`UserId from route: ${userId}`);

    } else {
      console.error('UserId not found in the route');
    }

    
  }

}

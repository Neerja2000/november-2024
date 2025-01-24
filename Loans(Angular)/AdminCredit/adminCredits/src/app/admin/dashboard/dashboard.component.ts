import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/shared/dashboad/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  emisList: any[] = []; // All settled EMIs
  futureUnsettledEmis: any[] = []; // Future unsettled EMIs
  pastUnsettledEmis: any[] = []; // Past unsettled EMIs
  today: string;
  constructor(private dashboardService: DashboardService)
   {
    this.today = new Date().toISOString().split('T')[0];
   }

  ngOnInit(): void {
    this.getAllEmis();
  }

  getAllEmis(): void {
    this.dashboardService.getAllEmis().subscribe(
      (data: any[]) => {
        const currentDate = new Date(); // Get current date
        
        // Filter settled EMIs (settled = 1)
        this.emisList = data.filter((emi) => emi.settled === 1);

        // Filter future unsettled EMIs (settled = 0, date >= current date)
        this.futureUnsettledEmis = data.filter(
          (emi) => emi.settled === 0 && new Date(emi.due_date) >= currentDate
        );

        // Filter past unsettled EMIs (settled = 0, date < current date)
        this.pastUnsettledEmis = data.filter(
          (emi) => emi.settled === 0 && new Date(emi.due_date) < currentDate
        );

        console.log('Filtered settled EMIs:', this.emisList);
        console.log('Future unsettled EMIs:', this.futureUnsettledEmis);
        console.log('Past unsettled EMIs:', this.pastUnsettledEmis);
      },
      (error) => {
        console.error('Error fetching EMIs:', error);
      }
    );
  }
}


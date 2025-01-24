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

  constructor(private dashboardService: DashboardService) {
    this.today = new Date().toISOString().split('T')[0]; // Get current date in yyyy-mm-dd format
  }

  ngOnInit(): void {
    this.getAllEmis();
  }

  getAllEmis(): void {
    this.dashboardService.getAllEmis().subscribe(
      (data: any[]) => {
        const currentDate = new Date(); // Get current date
        
        // Filter and calculate EMI + Interest for settled EMIs (settled = 1)
        this.emisList = data
          .filter((emi) => emi.settled === 1)
          .map((emi) => ({
            ...emi,
            emi_with_interest: emi.principal_amount + emi.interest_amount // Calculate EMI + Interest
          }));

        // Filter and calculate EMI + Interest for future unsettled EMIs (settled = 0, date >= current date)
        this.futureUnsettledEmis = data
          .filter((emi) => emi.settled === 0 && new Date(emi.due_date) >= currentDate)
          .map((emi) => ({
            ...emi,
            emi_with_interest: emi.principal_amount + emi.interest_amount // Calculate EMI + Interest
          }));

        // Filter and calculate EMI + Interest for past unsettled EMIs (settled = 0, date < current date)
        this.pastUnsettledEmis = data
          .filter((emi) => emi.settled === 0 && new Date(emi.due_date) < currentDate)
          .map((emi) => ({
            ...emi,
            emi_with_interest: emi.principal_amount + emi.interest_amount // Calculate EMI + Interest
          }));

        // Log the filtered and calculated lists
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

import { Component, OnInit } from '@angular/core';
import { DashboardTabList, DashboardTabs } from '@core/modals/dashboard.modal';

@Component({
  selector: 'app-explore-dashboard',
  templateUrl: './explore-dashboard.component.html',
  styleUrls: ['./explore-dashboard.component.scss']
})
export class ExploreDashboardComponent implements OnInit {
  tabList: DashboardTabList[] = [
    {
      tabLink: "software-usage-expenditure",
      translate: "SOFTWARE_USAGE_EXPENDITURE"
    },
    {
      tabLink: "maintenance",
      translate: "MAINTENANCE"
    },
    {
      tabLink: "park",
      translate: "PARK"
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}

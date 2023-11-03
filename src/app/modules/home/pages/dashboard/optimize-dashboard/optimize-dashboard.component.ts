import { Component, OnInit } from '@angular/core';
import { DashboardTabList } from '@core/modals/dashboard.modal';

@Component({
  selector: 'app-optimize-dashboard',
  templateUrl: './optimize-dashboard.component.html',
  styleUrls: ['./optimize-dashboard.component.scss']
})
export class OptimizeDashboardComponent implements OnInit {
  tabList: DashboardTabList[] = [
    {
      tabLink: "software-expenditure",
      translate: "SOFTWARE_EXPENDITURE"
    },
    {
      tabLink: "effective-license-position",
      translate: "EFFECTIVE_LICENSE_POSITION"
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}

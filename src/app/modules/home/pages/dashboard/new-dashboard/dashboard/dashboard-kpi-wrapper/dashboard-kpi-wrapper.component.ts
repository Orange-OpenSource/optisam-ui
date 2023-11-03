import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-kpi-wrapper',
  templateUrl: './dashboard-kpi-wrapper.component.html',
  styleUrls: ['./dashboard-kpi-wrapper.component.scss']
})
export class DashboardKpiWrapperComponent implements OnInit {
  @Input() title: string = "";
  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss'],
})
export class SimulationComponent implements OnInit, AfterContentChecked {
  tabMenus = [
    { title: 'Cost', link: '/optisam/simulation/metrics' },
    // { title: 'Hardware', link: '/optisam/simulation/hardware' },
  ];
  activeLink = this.tabMenus[0].link;
  constructor(private router: Router) {
    this.activeLink = this.router.url;
  }

  ngOnInit() {}

  ngAfterContentChecked() {
    this.activeLink = this.router.url;
  }
}

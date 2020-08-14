// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit, AfterContentChecked {
  tabMenus = [
    { title: 'Metrics', link: '/optisam/simulation/metrics'},
    { title: 'Hardware', link: '/optisam/simulation/hardware'}
  ];
  activeLink = this.tabMenus[0].link;
  constructor(
    private router: Router
  ) {
    this.activeLink = this.router.url;
   }

  ngOnInit() {
  }
  
  ngAfterContentChecked() {
    this.activeLink = this.router.url;
  }
}

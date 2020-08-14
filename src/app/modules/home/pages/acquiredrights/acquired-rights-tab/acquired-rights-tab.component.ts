// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acquired-rights-tab',
  templateUrl: './acquired-rights-tab.component.html',
  styleUrls: ['./acquired-rights-tab.component.scss']
})
export class AcquiredRightsTabComponent implements OnInit {
  tabMenus = [
    { title: 'Individual', link: '/optisam/ar/prights'},
    { title: 'Aggregations', link: '/optisam/ar/prights/aggregations'}
  ];
  activeLink = this.tabMenus[0].link;
  constructor( private router: Router) {
    this.activeLink = this.router.url;
  }

  ngOnInit() {
  }

}

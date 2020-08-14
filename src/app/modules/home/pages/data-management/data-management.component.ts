// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})
export class DataManagementComponent implements OnInit, AfterContentChecked {
  tabMenus = [
    { title: 'Data', link: '/optisam/dm/data'},
    { title: 'Metadata', link: '/optisam/dm/metadata'}
  ];
  activeLink = this.tabMenus[0].link;
  constructor(private router: Router) { 
    this.activeLink = this.router.url; }

  ngOnInit() {
  }
  
  ngAfterContentChecked() {
    this.activeLink = this.router.url;
  }
}

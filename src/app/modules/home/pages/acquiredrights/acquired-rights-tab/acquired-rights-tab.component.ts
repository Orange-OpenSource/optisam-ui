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
    { title: 'Aggregations', link: '/optisam/ar/prights/aggregaions'}
  ];
  activeLink = this.tabMenus[0].link;
  constructor( private router: Router) {
    this.activeLink = this.router.url;
  }

  ngOnInit() {
  }

}
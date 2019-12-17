import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-tabs',
  templateUrl: './product-tabs.component.html',
  styleUrls: ['./product-tabs.component.scss']
})
export class ProductTabsComponent implements OnInit {
  tabMenus = [
    { title: 'Individual', link: '/optisam/pr/products'},
    { title: 'Aggregations', link: '/optisam/pr/products/aggregaions'}
  ];
  activeLink = this.tabMenus[0].link;
  constructor( private router: Router) {
    this.activeLink = this.router.url;
  }

  ngOnInit() {
  }

}

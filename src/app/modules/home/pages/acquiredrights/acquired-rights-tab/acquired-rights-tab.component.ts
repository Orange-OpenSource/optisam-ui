import {
  Component,
  OnInit,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acquired-rights-tab',
  templateUrl: './acquired-rights-tab.component.html',
  styleUrls: ['./acquired-rights-tab.component.scss'],
})
export class AcquiredRightsTabComponent implements OnInit, AfterViewChecked {
  tabMenus = [
    { title: 'Individual', link: '/optisam/ar/prights' },
    { title: 'Aggregations', link: '/optisam/ar/prights/aggregations' },
  ];
  activeLink = this.tabMenus[0].link;
  constructor(private router: Router, private cd: ChangeDetectorRef) {
    // this.activeLink = this.router.url;
  }
  ngOnInit() {}
  ngAfterViewChecked() {
    this.activeLink = this.router.url;
    this.cd.detectChanges();
  }
}

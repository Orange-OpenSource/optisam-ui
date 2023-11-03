import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardScrollTabList } from '@core/modals';
import { CommonService, ProductService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  lastUpdatedDate: string;
  nextUpdateDate: string;
  currentScope: string = this.cs.getLocalData(LOCAL_KEYS.SCOPE);
  tabList: DashboardScrollTabList[] = [
    {
      fragment: "overview",
      translate: "OVERVIEW",
    },
    {
      fragment: "effective-license-position",
      translate: "EFFECTIVE_LICENSE_POSITION"
    },
    {
      fragment: "software-usage-and-expenditure",
      translate: "SOFTWARE_USAGE_AND_EXPENDITURE"
    },
    {
      fragment: "maintenance",
      translate: "MAINTENANCE"
    },
    {
      fragment: "park",
      translate: "PARK"
    },
  ];
  currentTab: string = this.tabList[0].fragment;
  isFirstLoad: boolean = true;

  constructor(private productService: ProductService, private cs: CommonService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.getDashboardUpdateInfo();
  }

  ngAfterViewInit(): void {
    this.navigateToFragment();
  }


  getDashboardUpdateInfo() {
    this.lastUpdatedDate = null;
    this.nextUpdateDate = null;
    this.productService
      .getDashboardUpdateInfo(this.currentScope, 'CEST')
      .subscribe(
        (res) => {
          this.lastUpdatedDate = res.updated_at;
          this.nextUpdateDate = res.next_update_at;
        },
        (err) => {
          console.log(
            'Some error occured! Could not get Dashboard update details'
          );
        }
      );
  }

  scrollToView(fragment: string): void {
    this.currentTab = fragment;
    try {
      document.querySelector(`#${fragment}`).scrollIntoView(
        <ScrollIntoViewOptions>{ ...(!this.isFirstLoad && { behavior: 'smooth' }) }
      );
      this.isFirstLoad = false;
    } catch (e) {
      console.log(e)
    }
  }

  navigateToFragment(): void {
    this.route.fragment.subscribe(((fragment) => {
      if (fragment) {

        console.log(document.querySelector(`#${fragment}`).clientHeight)
        setTimeout(() => {
          this.scrollToView(fragment);
        }, 0);
      }
    }))
  }

}

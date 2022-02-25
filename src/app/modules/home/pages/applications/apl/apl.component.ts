import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  HostListener,
  ElementRef,
} from '@angular/core';
import { ApplicationService } from 'src/app/core/services/application.service';
import { Router } from '@angular/router';
import { local } from 'd3';
import { SharedService } from '../../../../../shared/shared.service';
import { Subscription } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-apl',
  templateUrl: './apl.component.html',
  styleUrls: ['./apl.component.scss'],
})
export class AplComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  MyDataSource: any;
  searchKey: string;
  length;
  pageSize = 50;
  sort_order: any;
  sort_by: any;
  applicationId: any;
  saveSelectedAppName: string;
  saveSelectedOwner: string;
  current_page_num: any;
  filteringOrder: any;
  appName: any;
  owner: any;
  page_size: any;
  pageEvent: any;

  displayedColumns: string[] = [
    'name',
    'owner',
    'domain',
    'obsolescence_risk',
    'num_of_products',
    'num_of_instances',
  ];
  loadingSubscription: Subscription;
  _loading: Boolean;

  advanceSearchModel: any = {
    title: 'Search by Application Name',
    primary: 'appName',
    other: [
      { key: 'appName', label: 'Application name' },
      { key: 'owner', label: 'Owner' },
      { key: 'domain', label: 'Domain' },
      { key: 'risk', label: 'Obsolescence Risk' },
    ],
  };
  searchFields: any = {};

  constructor(
    private applicationservice: ApplicationService,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((data) => {
        this._loading = data;
      });
    this.current_page_num = 1;
    const state = window.history.state || {};
    if (
      state['appName'] != undefined ||
      state['owner'] != undefined ||
      state['domain'] != undefined ||
      state['risk'] != undefined
    ) {
      this.searchFields = state;
      this.applyFilter();
    } else {
      this.RenderDataTable();
    }
  }

  ngOnInit() {}

  RenderDataTable() {
    this.applicationservice.getApplications(this.pageSize, 1).subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.applications);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
      },
      (error) => {
        console.log('There was an error while retrieving Posts !!!' + error);
      }
    );
  }

  getPaginatorData(event) {
    this.MyDataSource = null;
    const page_num = event.pageIndex;
    this.current_page_num = page_num + 1;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.sort_order = localStorage.getItem('application_direction');
    this.sort_by = localStorage.getItem('application_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'name';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.applicationservice
      .filteredData(
        page_num + 1,
        this.pageSize,
        this.sort_by,
        this.sort_order,
        this.searchFields.appName?.trim(),
        this.searchFields.owner?.trim(),
        this.searchFields.domain?.trim(),
        this.searchFields.risk?.trim()
      )
      .subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.applications);
          this.MyDataSource.sort = this.sort;
        },
        (error) => {
          console.log('There was an error while retrieving Posts !!!' + error);
        }
      );
  }

  sortData(sort) {
    this.MyDataSource = null;
    localStorage.setItem('application_direction', sort.direction);
    localStorage.setItem('application_active', sort.active);
    this.applicationservice
      .filteredData(
        this.current_page_num,
        this.pageSize,
        sort.active,
        sort.direction,
        this.searchFields.appName?.trim(),
        this.searchFields.owner?.trim(),
        this.searchFields.domain?.trim(),
        this.searchFields.risk?.trim()
      )
      .subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.applications);
          this.MyDataSource.sort = this.sort;
        },
        (error) => {
          console.log('There was an error while retrieving Posts !!!' + error);
        }
      );
  }

  productDetails(aplName, key) {
    localStorage.setItem('appName', aplName);
    localStorage.setItem('key', key);
    localStorage.setItem('aplFilter', JSON.stringify(this.searchFields));
    this.router.navigate(['/optisam/apl/applications', key]);
  }

  instanceDetails(aplName, app_id) {
    localStorage.setItem('appName', aplName);
    localStorage.setItem('key', app_id);
    localStorage.setItem('aplFilter', JSON.stringify(this.searchFields));
    this.router.navigate(['/optisam/apl/instances', app_id]);
  }

  applyFilter() {
    this.MyDataSource = null;
    this.current_page_num = 1;
    this.sort_order = localStorage.getItem('application_direction');
    this.sort_by = localStorage.getItem('application_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'name';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.applicationservice
      .filteredData(
        this.current_page_num,
        this.pageSize,
        this.sort_by,
        this.sort_order,
        this.searchFields.appName?.trim(),
        this.searchFields.owner?.trim(),
        this.searchFields.domain?.trim(),
        this.searchFields.risk?.trim()
      )
      .subscribe((res: any) => {
        this.MyDataSource = new MatTableDataSource(res.applications);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
      });
  }

  advSearchTrigger(event) {
    this.searchFields = event;
    this.applyFilter();
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}

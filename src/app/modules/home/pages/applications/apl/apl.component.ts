import { Component, OnInit, ViewChild, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ApplicationService } from 'src/app/core/services/application.service';
import { Router } from '@angular/router';
import { local } from 'd3';
import { SharedService } from '../../../../../shared/shared.service';
import { Subscription } from 'rxjs';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-apl',
  templateUrl: './apl.component.html',
  styleUrls: ['./apl.component.scss']
})
export class AplComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  MyDataSource: any;
  searchKey: string;
  length ;
  pageSize = 10;
  sort_order: any;
  sort_by: any;
  applicationId: any;
  saveSelectedAppName: string;
  saveSelectedOwner: string;
  current_page_num: any;
  filteringOrder: any;
  appnamePlaceholder: any;
  ownerPlaceholder: any;
  page_size: any;
  pageEvent: any;

  displayedColumns: string[] = ['name', 'application_owner', 'numofProducts', 'numOfInstances',  'numofEquipment',  'totalCost'];
  loadingSubscription: Subscription;
  _loading: Boolean;

  advanceSearchModel: any = {
    title: 'Search by Application Name',
    primary: 'appnamePlaceholder',
    other: [
      {key: 'appnamePlaceholder', label: 'Application name'},
      {key: 'ownerPlaceholder', label: 'Owner'}
    ]
  };
  searchFields: any = {};

  constructor(
    private applicationservice: ApplicationService,
    private router: Router,
    private sharedService: SharedService
    ) {
      this.loadingSubscription = this.sharedService.httpLoading().subscribe(data => {
        this._loading = data;
      });
  }

  ngOnInit() {
    this.current_page_num = 1;
    this.RenderDataTable();
  }

  RenderDataTable() {
    this.applicationservice.getApplications(10, 1).subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.applications);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  getPaginatorData(event) {
    this.MyDataSource = null;
    const page_num = event.pageIndex;
    this.current_page_num = page_num;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.sort_order = localStorage.getItem( 'application_direction');
    this.sort_by = localStorage.getItem( 'application_active');
    // console.log('getting from paging data navgation', this.sort_order, this.sort_by);
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'name';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
      this.applicationservice.filteredData(page_num + 1, this.pageSize,
         this.sort_by, this.sort_order, this.searchFields.appnamePlaceholder, this.searchFields.ownerPlaceholder).subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.applications);
          this.MyDataSource.sort = this.sort;
        },
        error => {
          console.log('There was an error while retrieving Posts !!!' + error);
        });
  }

  sortData(sort) {
    this.MyDataSource = null;
    localStorage.setItem('application_direction', sort.direction);
    localStorage.setItem('application_active', sort.active);
    this.applicationservice.filteredData( this.current_page_num, this.pageSize, sort.active,
      sort.direction, this.searchFields.appnamePlaceholder, this.searchFields.ownerPlaceholder).subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.applications);
        this.MyDataSource.sort = this.sort;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  productDetails(aplName, key) {
    localStorage.setItem('aplName', aplName);
    localStorage.setItem('key', key);
    this.router.navigate(['/optisam/apl/applications', key]);
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
    if (this.current_page_num === 0) {
      this.current_page_num = 1;
    }
    this.applicationservice.filteredData(this.current_page_num, this.pageSize,
      this.sort_by, this.sort_order, this.searchFields.appnamePlaceholder,
      this.searchFields.ownerPlaceholder).subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.applications);
          this.MyDataSource.sort = this.sort;
          this.length = res.totalRecords;
        }
      );
  }

  advSearchTrigger(event) {
    // console.log('trigger event => ', event);
    this.searchFields = event;
    this.applyFilter();
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}

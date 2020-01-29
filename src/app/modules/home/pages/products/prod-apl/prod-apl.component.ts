// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-prod-apl',
  templateUrl: './prod-apl.component.html',
  styleUrls: ['./prod-apl.component.scss']
})

export class ProdAplComponent implements OnInit {
  MyDataSource: any;
  searchKey: string;
  length;
  pageSize = 10;
  page_size: any;
  pageEvent: any;
  sort_order: any;
  sort_by: any;
  applicationId: any;
  saveSelectedAppName: string;
  saveSelectedOwner: string;
  current_page_num: any;
  filteringOrder: any;
  appnamePlaceholder: any;
  ownerPlaceholder: any;
  prodName: any;


  displayedColumns: string[] = ['name',  'numOfInstances', 'app_owner',  'numofEquipments'];
  _loading: Boolean;

  advanceSearchModel: any = {
    title: 'Search by Application Name',
    primary: 'appName',
    other: [
      {key: 'appName', label: 'Application name'},
      {key: 'owner', label: 'Owner'}
    ]
  };
  searchFields: any = {};

  constructor(private productservice: ProductService, private router: Router, private route: ActivatedRoute) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit() {
    this._loading = true;
    this.current_page_num = 1;
    this.RenderDataTable();
  }
  RenderDataTable() {
    const swidTag = (this.route.snapshot.paramMap.get('swidTag'));
    this.prodName = localStorage.getItem('prodName');
    this.productservice.getprodApplications(swidTag, 10, 1).subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.applications);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      });
  }
  getPaginatorData(event) {
    this._loading = true;
    this.MyDataSource = null;
    const page_num = event.pageIndex;
    this.current_page_num = page_num;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.sort_order = localStorage.getItem('prodApl_direction');
    this.sort_by = localStorage.getItem('prodApl_active');
    // console.log('getting from paging data navgation', this.sort_order, this.sort_by);
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'name';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.productservice.filteredData(page_num + 1, this.pageSize, this.searchFields.owner,
      this.sort_by, this.sort_order, this.searchFields.appName, this.searchFields.owner).subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.applications);
          this._loading = false;
        },
        error => {
          console.log('There was an error while retrieving Posts !!!' + error);
          this._loading = false;
        });
  }
  sortData(sort) {
    this._loading = true;
    this.MyDataSource = null;
    const swidTag = (this.route.snapshot.paramMap.get('swidTag'));
    localStorage.setItem('prodApl_direction', sort.direction);
    localStorage.setItem('prodApl_active', sort.active);
      this.productservice.prodAplfilteredData( swidTag, this.current_page_num, this.pageSize, sort.active,
      sort.direction, this.searchFields.appName, this.searchFields.owner).subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.applications);
        this.MyDataSource.sort = this.sort;
        this._loading = false;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      });
    }
  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  setSelectedSearch(param: string, value: number ) {
    if (value === 1) {
      this.saveSelectedAppName = param;
    }
    if (value === 2) {
      this.saveSelectedOwner = param;
    }
  }
  setSelected(param: string, value: number ) {
    if (value === 1) {
      this.saveSelectedAppName = param;
    }
    if (value === 2) {
      this.saveSelectedOwner = param;
    }
  }
  applyFilter() {
    this._loading = true;
    this.MyDataSource = null;
    const swidTag = (this.route.snapshot.paramMap.get('swidTag'));
    this.current_page_num = 1;
    this.sort_order = localStorage.getItem('prodApl_direction');
    this.sort_by = localStorage.getItem('prodApl_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'name';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    if (this.current_page_num === 0) {
      this.current_page_num = 1;
    }
    this.productservice.prodAplfilteredData(swidTag, this.current_page_num, this.pageSize,
      this.sort_by, this.sort_order, this.searchFields.appName,
      this.searchFields.owner).subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.applications);
          this.MyDataSource.sort = this.sort;
          this.length = res.totalRecords;
          this._loading = false;
        }
      );
  }
  clearFilter() {
    this.saveSelectedAppName  = undefined;
    this.saveSelectedOwner = undefined;
    this.appnamePlaceholder = null;
    this.ownerPlaceholder = null;
     this.applyFilter();
  }
  productInstances(app_id, appName) {
    const swidTag = (this.route.snapshot.paramMap.get('swidTag'));
    localStorage.setItem('appName', appName);
    this.router.navigate(['/optisam/pr/instances', swidTag, app_id]);
  }

  advSearchTrigger(event) {
    // console.log('trigger event => ', event);
    this.searchFields = event;
    this.applyFilter();
  }
}

// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-product-aggregation-applications',
  templateUrl: './product-aggregation-applications.component.html',
  styleUrls: ['./product-aggregation-applications.component.scss']
})
export class ProductAggregationApplicationsComponent implements OnInit {
  aggregationName: string;
  advanceSearchModel: any = {
    title: 'Search by Application Name',
    primary: 'search_params.name.filteringkey',
    other: [
      {key: 'search_params.name.filteringkey', label: 'Application name'},
      {key: 'search_params.application_owner.filteringkey', label: 'Application Owner'}
    ]
  };
  searchFields: any = {};

  productAggregationAppData: any;
  length: number;
  pageSize: number;
  page_size: any;
  current_page_num: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  searchQuery: string;
  sortQuery: string;

  displayedColumns: string[] = ['name', 'app_owner' , 'numOfInstances', 'numofEquipments'];
  sortColumn: string[] = ['name', 'app_owner' , 'numOfInstances', 'numofEquipments'];
  tableKeyLabelMap: any = {
      'name': 'Application Name',
      'app_owner': 'Application Owner',
      'numOfInstances': 'Instance Count',
      'numofEquipments': 'Equipment Count',
    };
  _loading: Boolean;

  constructor(
    private router: ActivatedRoute,
    private productService: ProductService
  ) {
    this.aggregationName = this.router.snapshot.params.agg_name;
    this.current_page_num = 1;
    this.page_size = 10;
  }

  ngOnInit() {
    this.getProductAggregationApplicationData();
  }

  getProductAggregationApplicationData() {
    this._loading = true;
    let query = '?page_num=' + this.current_page_num + '&page_size=' + this.page_size;
    query += (this.searchQuery ? this.searchQuery : '');
    query += (this.sortQuery ? this.sortQuery : '');
    this.productService.getProductAggregationApplications(this.aggregationName, query).subscribe(
      (res: any) => {
        this.productAggregationAppData = new MatTableDataSource(res.applications);
        this.productAggregationAppData.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      });
  }

  getPaginatorData(ev) {
    // console.log('event-pagination', ev);
    this.page_size = ev.pageSize;
    this.current_page_num = ev.pageIndex + 1;
    this.getProductAggregationApplicationData();
  }

  sortData(ev) {
    if (!ev.direction) {
      return false;
    }
    this.sortQuery = '&sorto_order=' + ev.direction.toUpperCase() + '&srt_by=';
    switch (ev.active) {
      case 'name':
        this.sortQuery += 'NAME';
        break;

      case 'app_owner':
        this.sortQuery += 'APPLICATION_OWNER';
        break;
      case 'numOfInstances':
        this.sortQuery += 'NUM_INSTANCES';
        break;
      case 'numofEquipments':
        this.sortQuery += 'NUM_EQUIPMENTS';
        break;

      default:
        break;
    }
    this.getProductAggregationApplicationData();
  }

  applyFilter() {
    this._loading = true;
    this.productAggregationAppData = null;
    if (this.current_page_num === 0) {
      this.current_page_num = 1;
    }
    this.searchQuery = '';
    this.sortQuery = '';
    Object.keys(this.searchFields).forEach((key) => {
      if (this.searchFields[key]) {
        this.searchQuery += '&' + key + '=' + this.searchFields[key];
      }
    });
    this.getProductAggregationApplicationData();
  }

  advSearchTrigger(event) {
    // console.log('trigger event => ', event);
    this.searchFields = event;
    this.applyFilter();
  }

}

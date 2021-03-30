// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, state, animate, transition } from '@angular/animations';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-acquired-rights-aggregation',
  templateUrl: './acquired-rights-aggregation.component.html',
  styleUrls: ['./acquired-rights-aggregation.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*', minHeight: '*'})),
      transition('expanded => collapsed', animate('200ms ease-out')),
      transition('collapsed => expanded', animate('200ms ease-in'))
    ])
  ]
})
export class AcquiredRightsAggregationComponent implements OnInit {
  public searchValue: any = {};
  arAggregationData: any;
  searchKey: string;
  swidTag: any;
  length ;
  pageSize = 10;
  sort_order: any;
  sort_by: any;
  selected: any;
  page_size: any;
  pageEvent: any;
  current_page_num: any;
  filteringOrder: any;
  productsListByAggrID: any[];

  displayedColumns: string[] = ['entity', 'SKU', 'swid_tag', 'aggregateName', 'editor', 'metric', 'total_cost'];
  expandDisplayedColumns: string[] = ['entity', 'SKU', 'swid_tag', 'product_name', 'version', 'editor', 'metric', 'acquired_licenses_number', 'licenses_under_maintenance_number', 'start_of_maintenance', 'end_of_maintenance', 'licenses_under_maintenance',  'avg_licenes_unit_price', 'avg_maintenance_unit_price', 'total_purchase_cost', 'total_maintenance_cost', 'total_cost'];
  sortColumn: string[] = ['aggregateName', 'editor', 'metric', 'total_cost'];
  tableKeyLabelMap: any = {
      'swid_tag':  'SwidTag',
      'product_name': 'Product Name',
      'editor': 'Editor',
      'version': 'Version',
      'total_cost': 'Total cost(€)',
      'num_applications': 'Application Count',
      'num_equipments': 'Equipment Count',
      'aggregateName': 'Aggregation Name',
      'SKU': 'SKU',
      'entity': 'Entity',
      "acquired_licenses_number": "Acquired licenses",
      'licenses_under_maintenance':"Licenses under maintenance",
      "licenses_under_maintenance_number": "Licenses under maintenance number",
      'start_of_maintenance':"Start of Maintenance",
      'end_of_maintenance':"End of Maintenance",
      "avg_licenes_unit_price": 'AVG license unit price (€)',
      "avg_maintenance_unit_price": 'AVG Maintenance unit price (€)',
      "total_purchase_cost": 'Total purchase cost (€)',
      "total_maintenance_cost": 'Total maintenance cost (€)',
      'metric': 'Metric'
    };
  _loading: Boolean;

  advanceSearchModel: any = {
    title: 'Search by Aggregation Name',
    primary: 'search_params.name.filteringkey',
    other: [
      {key: 'search_params.swidTag.filteringkey', label: 'SWIDtag'},
      {key: 'search_params.SKU.filteringkey', label: 'SKU'},
      {key: 'search_params.editor.filteringkey', label: 'Editor Name'},
      {key: 'search_params.name.filteringkey', label: 'Aggregation Name'},
      {key: 'search_params.metric.filteringkey', label: 'Metric'}
    ]
  };
  searchFields: any = {};
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  expandedRow: any;
  searchQuery: string;
  sortQuery: string;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.current_page_num = 1;
    this.page_size = 10;
   }

  ngOnInit() {
    this.getAcqiredRightsAggregationData();
  }

  getAcqiredRightsAggregationData() {
    this._loading = true;
    let query = '?page_num=' + this.current_page_num + '&page_size=' + this.page_size;
    this.sortQuery = (this.sortQuery ? this.sortQuery : '&sort_order=asc')
    query += this.sortQuery;
    this.searchQuery = this.searchQuery ? this.searchQuery : '&sort_by=NAME'
    query += this.searchQuery;
    console.log('query',this.searchQuery, '---', this.sortQuery);
    this.productService.getAggregationAcquiredRights(query).subscribe(
      (res: any) => {
        this.arAggregationData = new MatTableDataSource(res.aggregations);
        this.arAggregationData.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      });
  }

  getPaginatorData(ev) {
    console.log('event-pagination', ev);
    this.page_size = ev.pageSize;
    this.current_page_num = ev.pageIndex + 1;
    this.getAcqiredRightsAggregationData();
  }

  sortData(ev) {
    // console.log('event-sorting', ev);
    if (!ev.direction) {
      return false;
    }
    this.searchQuery = '';
    this.sortQuery = '';
    this.sortQuery = '&sort_order=' + ev.direction.toLowerCase();
    this.searchQuery = '&sort_by=';
    switch (ev.active) {
      case 'aggregateName':
        this.searchQuery += 'NAME';
        break;

      case 'editor':
      case 'total_cost':
      case 'metric':
        this.searchQuery += ev.active.toUpperCase();
        break;

      default:
        break;
    }
    this.getAcqiredRightsAggregationData();
  }

  getJoinedString(arr: any[], key: string, joinString: string) {
    return arr.map(d => d[key]).join(joinString);
  }


  applyFilter() {
    this._loading = true;
    this.arAggregationData = null;
    if (this.current_page_num === 0) {
      this.current_page_num = 1;
    }
    this.searchQuery = '';
    // this.sortQuery = '';
    Object.keys(this.searchFields).forEach((key) => {
      if (this.searchFields[key]) {
        this.searchQuery += '&' + key + '=' + this.searchFields[key];
      }
    });
    this.getAcqiredRightsAggregationData();
  }

  advSearchTrigger(event) {
    // console.log('trigger event => ', event);
    this.searchFields = event;
    this.applyFilter();
  }

  getProductDetails(ID) {
    this._loading = true;
    this.productService.getProductsByAggrID(ID).subscribe(res=>{
      this.productsListByAggrID = res.acquired_rights;
      console.log('acquired_rights : ', res.acquired_rights);
      this._loading = false;
    },err=>{
      console.log('Products could not be fetched!');
      this._loading = false;
    });
  }
  openDialog(value, name): void {
    const dialogRef = this.dialog.open(MoreDetailsComponent, {
      width: '850px',
      disableClose: true,
      data: {
          datakey : value,
          dataName : name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

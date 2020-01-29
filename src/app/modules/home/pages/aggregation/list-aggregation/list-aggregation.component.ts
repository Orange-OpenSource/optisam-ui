// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AggregationService } from 'src/app/core/services/aggregation.service';

@Component({
  selector: 'app-list-aggregation',
  templateUrl: './list-aggregation.component.html',
  styleUrls: ['./list-aggregation.component.scss']
})
export class ListAggregationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  aggregationData: any;
  displayedColumns: string[] = [
    'name',
    'product',
    'editor',
    'metric',
    'numofSwidTags',
    // 'action'
  ];
  totalRecords: number;
  pageSize: number;
  pageSizeOptions: number[];
  advanceSearchModel: any = {
    title: 'Search by Aggregation Name',
    primary: 'name',
    other: [
      {key: 'name', label: 'Aggregation Name'}
    ]
  };
  role: string;

  constructor(
    private aggregationService: AggregationService
  ) {
    this.pageSize = 10;
    this.pageSizeOptions = [10, 20, 30, 50];
  }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.getAggregations();
  }

  getAggregations() {
    this.aggregationService.getAggregations('').subscribe(data => {
      this.aggregationData = data.aggregations || []; // new MatTableDataSource(data.aggregations);
    }, error => {
      console.log('There was an error while retrieving aggregations !!!' + error);
    });
  }

  advSearchTrigger(ev: any) {
    console.log('trigger =>', ev);
  }

  sortData(ev: any) {
    console.log('sort =>', ev);
  }

  getPaginatorData(ev: any) {
    console.log('pagination', ev);
  }
}

// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AggregationService } from 'src/app/core/services/aggregation.service';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { EditAggregationDialogComponent } from '../edit-aggregation-dialog/edit-aggregation-dialog.component';
import { CreateAggregationComponent } from '../create-aggregation/create-aggregation.component';

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
    'product_names',
    'editor',
    'metric',
    'numofSwidTags',
    'action'
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
  _loading: Boolean;
  selectedAggregation:any;

  constructor(
    private aggregationService: AggregationService,
    public dialog: MatDialog,
    private aggService: AggregationService
  ) {
    this.pageSize = 10;
    this.pageSizeOptions = [10, 20, 30, 50];
    dialog.afterAllClosed.subscribe((res)=>this.getAggregations());
  }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    // this.getAggregations();
  }

  getAggregations() {
    this._loading = true;
    this.aggregationService.getAggregations('').subscribe(data => {
      this.aggregationData = data.aggregations || []; // new MatTableDataSource(data.aggregations);
      this._loading = false;
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
  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '50%',
        disableClose: true
    });
  }

  deleteAggregationConfirmation(aggregate:any, deleteConfirmation) {
    this.selectedAggregation = aggregate;
    this.openModal(deleteConfirmation);
  }
  
  deleteAggregation(aggregate: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: {
        title : 'Delete Aggregation',
        content : 'Are you sure you want to delete ' + aggregate.name,
        type: 'deleteProductAggregate',
        id: aggregate.ID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.getAggregations();
      }
    });
  }

  deleteProductAggregation(successMsg, errorMsg) {
    this.aggService.deleteAggregation(this.selectedAggregation.ID).subscribe(resp => {
      this._loading = false;
      this.openModal(successMsg);
    }, err => {
      this._loading = false;
      this.openModal(errorMsg);
    });
  }

  editAggregation(aggregation: any) {
    const dialogRef = this.dialog.open(EditAggregationDialogComponent, {
      width: '80vw',
      autoFocus: false,
      disableClose: true,
      data: aggregation,
      maxHeight:'500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.getAggregations();
      }
    });
  }

  addNew() {
    const dialogRef = this.dialog.open(CreateAggregationComponent, {
      width: '60vw',
      disableClose:true,
      maxHeight:'500px'
    })
  }
}

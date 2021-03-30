// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { EditAggregationDialogComponent } from '../edit-aggregation-dialog/edit-aggregation-dialog.component';
import { CreateAggregationComponent } from '../create-aggregation/create-aggregation.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-list-aggregation',
  templateUrl: './list-aggregation.component.html',
  styleUrls: ['./list-aggregation.component.scss']
})
export class ListAggregationComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  aggregationData: any;
  displayedColumns: string[];
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
    private productService: ProductService,
    public dialog: MatDialog ) {
    this.role = localStorage.getItem('role');
    this.pageSize = 10;
    this.pageSizeOptions = [10, 20, 30, 50];
    this.displayedColumns = [
      'name',
      'product_names',
      'editor',
      'metric',
      'numofSwidTags'
    ]
    if(this.role == 'ADMIN' || this.role == 'SUPER_ADMIN') {
      this.displayedColumns.push('action');
    }
    dialog.afterAllClosed.subscribe((res)=>this.getAggregations());
  }

  ngOnInit() {
    
    // this.getAggregations();
  }

  getAggregations() {
    this._loading = true;
    this.productService.getAggregations().subscribe(data => {
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
  openModal(templateRef,width) {
    let dialogRef = this.dialog.open(templateRef, {
        width: width,
        disableClose: true
    });
  }

  deleteAggregationConfirmation(aggregate:any, deleteConfirmation) {
    this.selectedAggregation = aggregate;
    this.openModal(deleteConfirmation,'40%');
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
    this.productService.deleteAggregation(this.selectedAggregation.ID).subscribe(resp => {
      this._loading = false;
      this.openModal(successMsg,'30%');
    }, err => {
      this._loading = false;
      this.openModal(errorMsg,'30%');
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

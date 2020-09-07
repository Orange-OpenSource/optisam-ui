// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadDataComponent } from '../upload-data/upload-data.component';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataManagementService } from 'src/app/core/services/data-management.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-metadata',
  templateUrl: './list-metadata.component.html',
  styleUrls: ['./list-metadata.component.scss']
})
export class ListMetadataComponent implements OnInit {
  subscription: Subscription;
  MyDataSource: any;
  displayedColumns: string[] = ['file_name',
                                'status', 
                                'uploaded_by', 
                                'uploaded_on'
                                ];
  _loading: Boolean = false;
  current_page_num: any = 1;
  page_size: any = 10;
  length:any;
  sortQuery: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
                                
  constructor(private dialog: MatDialog,
    private dataService: DataManagementService) { 
      this.dialog.afterAllClosed.subscribe(res=>{
        this.getListData();
      });
    }

  ngOnInit() { }

  getListData() {
      this._loading = true;
      this.MyDataSource = null;
      let query = '?page_num=' + this.current_page_num + '&page_size=' + this.page_size;
      this.sortQuery = (this.sortQuery ? this.sortQuery : '&sort_order=desc&sort_by=uploaded_on');
      query += this.sortQuery; 
    
      this.subscription = this.dataService.getUploadedMetadata(query).subscribe(res => {
      this.MyDataSource = new MatTableDataSource(res.uploads);
      this.MyDataSource.sort = this.sort;
      this.length = res.totalRecords;
      this._loading = false;
    },err => {
      console.log('Data details could not be fetched!', err);
      this._loading = false;
    });
  }

  uploadDataFiles() {
    const dialogRef = this.dialog.open(UploadDataComponent, {
      autoFocus: false,
      disableClose: true,
      data: 'Metadata',
      maxHeight: '500px',
      width:'390px'
    });
  }
  
  sortData(ev) {
    if (!ev.direction) {
      return false;
    }
    this.sortQuery = '&sort_order=' + ev.direction.toLowerCase() + '&sort_by=';
    switch (ev.active) {
      case 'file_name':
        this.sortQuery += 'file_name';
        break;

      default:
        this.sortQuery += ev.active.toLowerCase();
        break;
    }
    this.getListData();
  }

  getPaginatorData(ev) {
    this.current_page_num = ev.pageIndex + 1;
    this.page_size = ev.pageSize;
    this.getListData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
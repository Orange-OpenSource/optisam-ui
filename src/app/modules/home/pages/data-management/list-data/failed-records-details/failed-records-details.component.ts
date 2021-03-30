// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DataManagementService } from 'src/app/core/services/data-management.service';
import { DialogData } from 'src/app/modules/home/dialogs/product-details/details';

@Component({
  selector: 'app-failed-records-details',
  templateUrl: './failed-records-details.component.html',
  styleUrls: ['./failed-records-details.component.scss']
})
export class FailedRecordsDetailsComponent implements OnInit {

  upload_id:string;
  _loading:Boolean;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] =[];//['application_id', 'name', 'owner','scope','version','reason']
  length:any;
  page_size:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataManagementService: DataManagementService) { }

  ngOnInit(): void {
    this.upload_id = this.data['upload_id'];
    this.getDetails();
  }

  formatAsColumnName(property) {
    const attr = property.replace('_',' ').replace(' id', ' ID')
    return attr.substr(0,1).toUpperCase() + attr.substr(1,attr.length-1);
  }
  
  getDetails() {
    this._loading = true;
    this.dataManagementService.getFailedRecordsInfo(this.upload_id, 1, 50).subscribe(res => {
      if(res.failedRecords && Object.keys(res.failedRecords).length > 0) {
        this.dataSource = new MatTableDataSource(res.failedRecords);
        for (const property in res.failedRecords[0].data) {
          this.displayedColumns.push(property);
        }
        this.displayedColumns.push('reason');
      }
      this.length = res.totalRecords||0;
      this._loading = false;
    },err=>{
      this._loading = false;
      console.log('Some error occured! Could not fetch failed records info.')
    });
  }

  getPaginatorData(event) {
    this._loading = true;
    this.dataManagementService.getFailedRecordsInfo(this.upload_id,event.pageIndex + 1, event.pageSize).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.failedRecords);
      this.length = res.totalRecords;
      this._loading = false;
    },err=>{
      this._loading = false;
      console.log('Some error occured! Could not fetch failed records info.')
    });
  }

}

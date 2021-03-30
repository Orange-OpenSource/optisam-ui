// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import {Component, OnInit} from '@angular/core';
import { MetricCreationComponent } from '../metric-creation/metric-creation.component';
import { MetricDetailsComponent } from '../metric-details/metric-details.component';
import { MetricService } from 'src/app/core/services/metric.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

  @Component({
    selector: 'app-metric-view',
    templateUrl: './metric-view.component.html',
    styleUrls: ['./metric-view.component.scss']
  })
  export class MetricViewComponent implements OnInit {

    displayedColumns = ['type', 'name',  'description'];
    // dataSource: ExampleDataSource | null;
    index: number;
    id: string;
    equipment_types = [];
    role: String;
    _loading: Boolean;
    MyDataSource: MatTableDataSource<{}>;
    noDataAvailableFlag :Boolean;
     
    constructor(public  metricService: MetricService, public dialog: MatDialog) {
      if(this.dialog.afterAllClosed) {
        this.dialog.afterAllClosed.subscribe(res => this.loadData());
      }
     }

    ngOnInit() {
      this.role = localStorage.getItem('role');
    }
    addNew() {
      const dialogRef = this.dialog.open(MetricCreationComponent, {
        data: {},
        autoFocus:false,
        disableClose: true
      });
    }

    openDetails(metric) {
      this.dialog.open(MetricDetailsComponent, {
        width: '800px',
        disableClose: true,
        autoFocus:false,
        maxHeight: '90vh',
        data: metric
        });
    }
    
    loadData() {
      this._loading = true;
      this.metricService.getMetricList().subscribe(
       (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.metrices);
          if(this.MyDataSource.data.length == 0) {
            this.noDataAvailableFlag = true;
          } else {
            this.noDataAvailableFlag = false;
          }
          this._loading = false;
        },
        (error) => {
          if(error.error == 'cannot fetch metric types') {
            this.noDataAvailableFlag = true;
          } else {
            this.noDataAvailableFlag = false;
          }
          this._loading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        });
    }
  }

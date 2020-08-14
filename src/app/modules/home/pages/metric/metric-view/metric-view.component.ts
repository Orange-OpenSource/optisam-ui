// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
  import {HttpClient} from '@angular/common/http';
  import {MatDialog, MatTableDataSource } from '@angular/material';
  import {DataSource} from '@angular/cdk/collections';
  import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
  import {map} from 'rxjs/operators';
import { MetricCreationComponent } from '../metric-creation/metric-creation.component';
import { MetricDetailsComponent } from '../metric-details/metric-details.component';
import { MetricService } from 'src/app/core/services/metric.service';

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
      this.dialog.afterAllClosed.subscribe(res => this.loadData() );
     }

    ngOnInit() {
      this.role = localStorage.getItem('role');
      this.loadData();
    }
    refresh() {
      this.loadData();
    }
    addNew() {
      const dialogRef = this.dialog.open(MetricCreationComponent, {
        data: {},
        autoFocus:false,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          // // When using an edit things are little different, firstly we find record inside DataService by id
          // const foundIndex = this.equipmentTypeService.dataChange.value.findIndex(x => x.id === this.id);
          // // Then you update that record using data from dialogData (values you enetered)
          // this.equipmentTypeService.dataChange.value[foundIndex] = this.equipmentTypeManagementService.getDialogData();
          // // And lastly refresh table
          this.loadData();
        }
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
    
    public loadData() {
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

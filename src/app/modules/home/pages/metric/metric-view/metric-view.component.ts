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
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';

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
    MyDataSource: MatTableDataSource<{}>;
    constructor(public equipmentTypeManagementService: EquipmentTypeManagementService, public dialog: MatDialog) { }

    ngOnInit() {
      this.role = localStorage.getItem('role');
      this.loadData();
    }
    refresh() {
      this.loadData();
    }
    addNew() {
      const dialogRef = this.dialog.open(MetricCreationComponent, {
        data: {}
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
    public loadData() {
      this.equipmentTypeManagementService.getMetricList().subscribe(
       (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.metrices);
                console.log('data', this.MyDataSource);
                // this.dataSource.sort = this.sort;
                // this.length = res.totalRecords;

                console.log('test---------', res.metrices);
        },
        (error) => {
          console.log('There was an error while retrieving Posts !!!' + error);
          // this.getEquipmentsData(this.displayedColumns2[0]);
        });
    }
  }

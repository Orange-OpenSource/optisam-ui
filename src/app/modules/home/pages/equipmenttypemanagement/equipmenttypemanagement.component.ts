// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EquipmentTypeManagementService} from '../../../../core/services/equipmenttypemanagement.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatTableDataSource } from '@angular/material';
import {Type} from './model';
import {DataSource} from '@angular/cdk/collections';
import {AddComponent} from './dialogs/add/add.component';
import {EditComponent} from './dialogs/edit/edit.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { ListComponent } from './dialogs/list/list.component';
import { RequiredJSONFormat } from './dialogs/model';

@Component({
  selector: 'app-equipmenttypemanagement',
  templateUrl: './equipmenttypemanagement.component.html',
  styleUrls: ['./equipmenttypemanagement.component.scss']
})
export class EquipmenttypemanagementComponent implements OnInit {
  role: String;
  displayedColumns = ['type', 'metadata_source',  'parent_type', 'attributes' , 'actions'];
  equipmentTypeService: EquipmentTypeManagementService | null;
  // dataSource: ExampleDataSource | null;
  index: number;
  id: string;
  equipment_types = [];
  _loading: Boolean;
  datasource: MatTableDataSource<{}>;
  mydatasource: MatTableDataSource<{}>;
  MyDataSource: MatTableDataSource<{}>;
  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public equipmentTypeManagementService: EquipmentTypeManagementService) {
                this.dialog.afterAllClosed.subscribe(res=> this.loadData());
              }

  ngOnInit() {
 this.role = localStorage.getItem('role');
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddComponent, {
      data: {},
      autoFocus:false,
      maxHeight:'500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.loadData();
      }
    });
  }

  startEdit(id: string, type: string, metadata_id: string,
    metadata_source: string, parent_type: string, parent_id: string, attributes: string) {
    const dialogRef = this.dialog.open(EditComponent, {
      // width: '850px',
      maxHeight:'500px',
      autoFocus:false,
      data: {
        id: id, type: type, metadata_id: metadata_id,
        metadata_source: metadata_source, parent_type: parent_type, parent_id: parent_id, attributes: attributes
      },
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

  listAttributes(name, attributes) {
    console.log('list data', attributes);
    const dialogRef = this.dialog.open(ListComponent, {
      width: '850px',
      maxHeight: '500px',
      autoFocus: false,
      data: { name, attributes },
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

  public loadData() {
    this._loading = true;
    this.equipmentTypeManagementService.getAllTypes().subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.equipment_types);
        console.log('data', this.MyDataSource);
        // this.dataSource.sort = this.sort;
        // this.length = res.totalRecords;
        this._loading = false;
      },
      error => {
        this._loading = false;
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
}

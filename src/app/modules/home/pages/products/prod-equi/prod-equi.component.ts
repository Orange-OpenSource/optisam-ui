// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild,  } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog  } from '@angular/material';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { debug } from 'util';
import { SharedService } from 'src/app/shared/shared.service';



@Component({
  selector: 'app-prod-equi',
  templateUrl: './prod-equi.component.html',
  styleUrls: ['./prod-equi.component.scss']
})
export class ProdEquiComponent implements OnInit {
  dataSource: any;
  type: any;
  equipName;
  MyDataSource: MatTableDataSource<{}>;
  displayedColumns: any[];
  displayedColumns2: any[];
  displayedrows: any[] = [];
  id: any;
  name: any;
  length;
  pageSize = 10;
  sort_order: any;
  sort_by: any;
  page_size: any;
  selectedColumn: string;
  pageEvent: any;
  current_page_num: any;
  sName = [];
  allType: any;
  equiId: any;
  productName: String;
  filterGroup: FormGroup;

  advanceSearchModel: any = {
    title: '',
    primary: '',
    other: []
  };
  searchFields: any = {};

  constructor(
    public httpClient: HttpClient,
    private router: Router,
    public equipmentTypeManagementService: EquipmentTypeManagementService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  swidTag: String;

  ngOnInit() {
    this.productName = localStorage.getItem('prodName');
    this.swidTag = (this.route.snapshot.paramMap.get('swidTag'));
    this.filterGroup = new FormGroup({});
    this.equipmentTypeManagementService.getAllTypes().subscribe(
      (res: any) => {
        this.allType = res.equipment_types;
        console.log('res.equipment_types-----', res.equipment_types);
        this.MyDataSource = new MatTableDataSource(res.equipment_types);
        this.displayedColumns = [];
        const filteredData: any = this.MyDataSource.filteredData;
        this.displayedColumns2 = filteredData;
        this.MyDataSource.sort = this.sort;
        for (const pdata of filteredData) {
          this.displayedColumns.push(pdata.type);
        }
        this.getEquipmentsData(this.displayedColumns2[0]);
      },
      () => {
        // this.getEquipmentsData(this.displayedColumns2[0]);
      });
  }

  getFilterData(testData: any): string {
    return testData.filteredData;
  }
  getEquipmentsData(list) {
    this.sharedService.triggerClearSeach();
    this.sName = [];
    this.current_page_num = 1;
    this.id = list.ID;
    this.equiId = list.ID;
    this.equipName = list.type;
    this.selectedColumn = list.type;
    this.name = null;
    this.filterGroup.reset();
    this.searchFields = {};
    this.advanceSearchModel.primary = '';
    this.advanceSearchModel.title = '';
    this.advanceSearchModel.other = [];
    /* for (const attr of list.attributes) {
      if (attr.primary_key) {
        this.name = attr.name;
      }
    } */
  /*   for (const filter of list.attributes) {
      if (filter.searchable) {
        this.sName.push(filter.name);
        this.filterGroup.addControl(filter.name, new FormControl(null));
      }
    } */

    /* for (const filter of list.attributes) {
      if (filter.searchable) {
        if ( filter.name === 'HostName') {
        this.sName.push(filter.name);
        this.filterGroup.addControl(filter.name, new FormControl(null));
        }
      }
    }
    for (const filter of list.attributes) {
      if (filter.searchable) {
        if ( filter.name !== 'HostName') {
        this.sName.push(filter.name);
        this.filterGroup.addControl(filter.name, new FormControl(null));
        }
      }
    } */
    for (const filter of list.attributes) {
      if (filter.searchable) {
        if (filter.primary_key) {
          this.name = filter.name;
          this.advanceSearchModel.title = 'Search by ' + filter.name;
          this.advanceSearchModel.primary = filter.name;
        }
        this.advanceSearchModel.other.push({key: filter.name, label: filter.name});
      }
    }
    // console.log('swidTag--------', this.swidTag);
    this.equipmentTypeManagementService.getProdWithEquipments(this.swidTag, this.id, this.name, 10, 1).subscribe(
      (res: any) => {
        this.displayedrows = [];
        const encodedEquipments = res.equipments;
        const decodedEquipments: any = atob(encodedEquipments);
        const testData = new MatTableDataSource(decodedEquipments);
        this.dataSource = JSON.parse(this.getFilterData(testData));
        // console.log('data sources------', this.dataSource);
        this.length = res.totalRecords;
         const idValue = this.dataSource[0] ? this.dataSource[0].ID : '';
        if (this.dataSource.length > 0) {
          delete this.dataSource[0].ID;
          // tslint:disable-next-line:forin
          for (const x in this.dataSource[0]) {
            this.displayedrows.push(x);
          }
        }
        if (this.dataSource[0]) {
          this.dataSource[0].ID = idValue;
        }
        // console.log('this.displayedrows.', this.displayedrows);
      });
  }
  getPaginatorData(event) {
    const sort_by = this.name;
    const key = this.id;
    const page_num = event.pageIndex;
    this.current_page_num = page_num;
    this.length = event.length;
    this.pageSize = event.pageSize;
    const searchFilter = this.getSearchParams(this.searchFields);
    this.equipmentTypeManagementService.getProdWithEquipments(this.swidTag, key, sort_by, this.pageSize, page_num + 1, searchFilter).subscribe(
      (res: any) => {
        this.displayedrows = [];
        const encodedEquipments = res.equipments;
        const decodedEquipments: any = atob(encodedEquipments);
        const testData = new MatTableDataSource(decodedEquipments);
        this.dataSource = JSON.parse(this.getFilterData(testData));
        this.length = res.totalRecords;
        const idValue = this.dataSource[0] ? this.dataSource[0].ID: '';
        if (this.dataSource.length > 0) {
          delete this.dataSource[0].ID;
          // tslint:disable-next-line:forin
          for (const x in this.dataSource[0]) {
            this.displayedrows.push(x);
          }
        }
        if (this.dataSource[0]) {
          this.dataSource[0].ID = idValue;
        }
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  getSearchParams(searchFields) {
    let params = 'search_params=';
    for (const key in searchFields) {
      if (searchFields[key]) {
        if (params === 'search_params=') {
          params += key + '=' + searchFields[key];
        } else {
          params += ',' + key + '=' + searchFields[key];
        }
      }
    }
    return params;
  }

  applyFilter() {
    /* let searchFilter = 'search_params=';
    for (const key in this.searchFields) {
      if (this.searchFields[key]) {
        if (searchFilter === 'search_params=') {
          searchFilter += key + '=' + this.searchFields[key];
        } else {
          searchFilter += ',' + key + '=' + this.searchFields[key];
        }
      }
    } */
    const searchFilter = this.getSearchParams(this.searchFields);
    const sort_by = this.name;
    this.sort_order = localStorage.getItem('list_direction');
    this.sort_by = localStorage.getItem('list_active');
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    if (this.current_page_num === 0) {
      this.current_page_num = 1;
    }
    this.equipmentTypeManagementService.getProdWithEquipmentSearch(this.swidTag, this.id, this.current_page_num, this.pageSize,
      sort_by, this.sort_order, searchFilter).subscribe(
        (res: any) => {
          this.displayedrows = [];
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
          this.length = res.totalRecords;
          const idValue = this.dataSource[0] ? this.dataSource[0].ID: '';
          if (this.dataSource.length > 0) {
            delete this.dataSource[0].ID;
            // tslint:disable-next-line:forin
            for (const x in this.dataSource[0]) {
              this.displayedrows.push(x);
            }
          }
          if (this.dataSource[0]) {
            this.dataSource[0].ID = idValue;
          }
        }
      );
  }
  sortData(event) {
    const key = this.id;
    localStorage.setItem('list_direction', event.direction);
    localStorage.setItem('list_active', event.active);
    const searchFilter = this.getSearchParams(this.searchFields);
    this.equipmentTypeManagementService.sortEquipments(key, this.current_page_num, this.pageSize,
      event.active, event.direction, searchFilter).subscribe(
        (res: any) => {
          this.displayedrows = [];
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
          this.length = res.totalRecords;
          const idValue = this.dataSource[0].ID;
          if (this.dataSource.length > 0) {
            delete this.dataSource[0].ID;
            // tslint:disable-next-line:forin
            for (const x in this.dataSource[0]) {
              this.displayedrows.push(x);
            }
            this.dataSource[0].ID = idValue;
          }
        },
        error => {
          console.log('There was an error while retrieving Posts !!!' + error);
        });
  }
  openDialog(typeId): void {
   /*  const dialogRef = this.dialog.open(AttributeDetailComponent, {
      width: '1600px',
      data: {
        typeId : typeId,
        equipName: this.equipName,
        equiId : this.equiId,
        types: this.allType
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    }); */
  }


  clearFilter() {
    this.filterGroup.reset();
    this.applyFilter();
   }

   advSearchTrigger(event) {
    // console.log('trigger event => ', event);
    this.searchFields = event;
    this.applyFilter();
  }
}

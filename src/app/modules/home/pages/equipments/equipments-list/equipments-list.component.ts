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
import { AttributeDetailComponent } from '../attribute-detail/attribute-detail.component';
import { SharedService } from 'src/app/shared/shared.service';


@Component({
  selector: 'app-equipments-list',
  templateUrl: './equipments-list.component.html',
  styleUrls: ['./equipments-list.component.scss']
})
export class EquipmentsListComponent implements OnInit {
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
  pageEvent: any;
  current_page_num: any;
  sName = [];
  allType: any;
  equiId: any;
  filterGroup: FormGroup;
  selectedColumn: string;
  _loading: Boolean;
  primaryKey: string;
  dynamicSearchForm: any = {};
  activeLink: any;
  moreRows:Boolean;

  advanceSearchModel: any = {
    title: '',
    primary: '',
    other: []
  };
  searchFields: any = {};

  constructor(public httpClient: HttpClient,
    public equipmentTypeManagementService: EquipmentTypeManagementService,
    public dialog: MatDialog,
    public sharedService: SharedService
    ) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.filterGroup = new FormGroup({});
    this.equipmentTypeManagementService.getAllTypes().subscribe(
      (res: any) => {
        this.allType = res.equipment_types;
        this.MyDataSource = new MatTableDataSource(res.equipment_types);
        this.displayedColumns = [];
        const filteredData: any = this.MyDataSource.filteredData;
        this.displayedColumns2 = filteredData;
        this.MyDataSource.sort = this.sort;
        for (const pdata of filteredData) {
          this.displayedColumns.push(pdata.type);
        }
        this.activeLink = this.displayedColumns2[0].type;
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
    this._loading = true;
    this.dataSource = null;
    this.selectedColumn = list.type;
    this.sName = [];
    this.current_page_num = 1;
    this.id = list.ID;
    this.equiId = list.ID;
    this.equipName = list.type;
    this.name = null;
    this.filterGroup.reset();
    this.dynamicSearchForm = {};
    this.searchFields = {};
    this.advanceSearchModel.primary = '';
    this.advanceSearchModel.title = '';
    this.advanceSearchModel.other = [];
    for (const attr of list.attributes) {
      if (attr.searchable) {
        if (attr.primary_key) {
          this.name = attr.name;
          this.advanceSearchModel.title = 'Search by ' + attr.name;
          this.advanceSearchModel.primary = attr.name;
        }
        this.advanceSearchModel.other.push({ key: attr.name, label: attr.name });
      }
    }
    this.equipmentTypeManagementService.getEquipmentsdata(this.id, this.name, 10, 1).subscribe(
      (res: any) => {
        this.displayedrows = [];
        const encodedEquipments = res.equipments;
        const decodedEquipments: any = atob(encodedEquipments);
        var headerList = [];
        for(var k in JSON.parse(decodedEquipments)[0]) {headerList.push(k);}
        if(headerList.length >= 8) {
          this.moreRows = true;
        } else {
          this.moreRows = false;
        }
        const testData = new MatTableDataSource(decodedEquipments);
        this.dataSource = JSON.parse(this.getFilterData(testData));
        this.length = res.totalRecords;
        this.paginator.pageIndex = 0;
        this.paginator.pageSize = 10;
        this._loading = false;
        this.displayedrows = this.makeTableRows(this.dataSource);
      });
  }
  getPaginatorData(event) {
    this._loading = true;
    this.dataSource = null;
    const sort_by = this.name;
    const key = this.id;
    const page_num = event.pageIndex;
    this.current_page_num = page_num;
    this.length = event.length;
    this.pageSize = event.pageSize;
    const searchFilter = this.getSearchParams(this.searchFields);
    this.equipmentTypeManagementService.getPaginatedData(key, sort_by, page_num + 1, this.pageSize, searchFilter).subscribe(
      (res: any) => {
        this.displayedrows = [];
        const encodedEquipments = res.equipments;
        const decodedEquipments: any = atob(encodedEquipments);
        const testData = new MatTableDataSource(decodedEquipments);
        this.dataSource = JSON.parse(this.getFilterData(testData));
        this.length = res.totalRecords;
        this._loading = false;
        this.displayedrows = this.makeTableRows(this.dataSource);
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  applyFilter() {
    this._loading = true;
    this.dataSource = null;
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
    this.equipmentTypeManagementService.filteredData(this.id, this.current_page_num, this.pageSize,
      sort_by, this.sort_order, searchFilter).subscribe(
        (res: any) => {
          this.displayedrows = [];
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
          this.length = res.totalRecords;
          this._loading = false;
          this.displayedrows = this.makeTableRows(this.dataSource);
        }
      );
  }
  sortData(event) {
    this._loading = true;
    this.dataSource = null;
    const key = this.id;
    localStorage.setItem('list_direction', event.direction);
    localStorage.setItem('list_active', event.active);
    const searchFilter = this.getSearchParams(this.searchFields);
    this.equipmentTypeManagementService.sortEquipments(key, this.current_page_num, this.pageSize,
      event.active, event.direction, null, searchFilter).subscribe(
        (res: any) => {
          this.displayedrows = [];
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
          this.length = res.totalRecords;
          this._loading = false;
          this.displayedrows = this.makeTableRows(this.dataSource);
        },
        error => {
          this._loading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        });
  }

  openDialog(ele,x): void {
    const dialogRef = this.dialog.open(AttributeDetailComponent, {
      width: '1600px',
      maxHeight: '550px',
      disableClose: true,
      data: {
        typeId : ele.ID,
        typeName : ele[x],
        equipName: this.equipName,
        equiId : this.equiId,
        types: this.allType
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  clearFilter() {
    this.filterGroup.reset();
    this.dynamicSearchForm = {};
    this.applyFilter();
   }

   prettyHeader(header: string): string {
    return header.replace(/([A-Z])/g, ' $1').trim();
   }

   makeTableRows(dataSource: any): any[] {
      const rows = [];
      if (dataSource.length > 0) {
        for (let i = 0; i < dataSource.length; i++) {
          Object.keys(dataSource[i]).forEach(key => {
            if (key === 'ID' || rows.indexOf(key) !== -1) {
              return;
            }
            rows.push(key);
          });
        }
      }
      return rows;
   }

   getSearchParams(obj: any): string {
    let searchFilter = 'search_params=';
    Object.keys(obj).forEach(key => {
      if (obj[key]) {
        if (searchFilter === 'search_params=') {
          searchFilter += key + '=' + obj[key];
        } else {
          searchFilter += ',' + key + '=' + obj[key];
        }
      }
    });
    return searchFilter;
   }

   advSearchTrigger(event) {
    this.searchFields = event;
    this.applyFilter();
  }
}

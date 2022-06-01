import { Component, OnInit, ViewChild } from '@angular/core';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { AttributeDetailComponent } from '../attribute-detail/attribute-detail.component';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-equipments-list',
  templateUrl: './equipments-list.component.html',
  styleUrls: ['./equipments-list.component.scss'],
})
export class EquipmentsListComponent implements OnInit {
  dataSource: any;
  type: any;
  equipName;
  MyDataSource: MatTableDataSource<{}>;
  displayedColumns: any[];
  displayedColumns2: any[] = [];
  displayedrows: any[] = [];
  id: any;
  name: any;
  length;
  pageSize = 50;
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
  _equipLoading: Boolean;
  primaryKey: string;
  dynamicSearchForm: any = {};
  activeLink: any;
  moreRows: Boolean;

  advanceSearchModel: any = {
    title: '',
    primary: '',
    other: [],
  };
  searchFields: any = {};

  constructor(
    public httpClient: HttpClient,
    public equipmentTypeManagementService: EquipmentTypeManagementService,
    public dialog: MatDialog,
    public sharedService: SharedService
  ) {}
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit() {
    this.filterGroup = new FormGroup({});
    this._loading = true;
    this.equipmentTypeManagementService.getTypes().subscribe(
      (res: any) => {
        this.allType = (res.equipment_types || []).reverse();
        this.MyDataSource = new MatTableDataSource(this.allType);
        this.displayedColumns = [];
        const filteredData: any = this.MyDataSource.filteredData;
        this.displayedColumns2 = filteredData;
        this.MyDataSource.sort = this.sort;
        for (const pdata of filteredData) {
          this.displayedColumns.push(pdata.type);
        }
        if (this.displayedColumns2.length > 0) {
          this.activeLink = this.displayedColumns2[0].type;
          this.getEquipmentsData(this.displayedColumns2[0]);
        }
        this._loading = false;
      },
      (err) => {
        this._loading = false;
      }
    );
  }

  getFilterData(testData: any): string {
    return testData.filteredData;
  }
  getEquipmentsData(list) {
    this.sharedService.triggerClearSeach();
    this._equipLoading = true;
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
      if (attr.primary_key && !attr.parent_identifier) {
        this.name = attr.name;
      }
      if (attr.searchable && !attr.parent_identifier) {
        if (attr.primary_key) {
          this.advanceSearchModel.title = 'Search by ' + attr.name;
          this.advanceSearchModel.primary = attr.name;
        }
        this.advanceSearchModel.other.push({
          key: attr.name,

          label: attr.name,
        });
      }
    }
    this.dataSource = null;
    this.displayedrows = [];
    this.equipmentTypeManagementService
      .getEquipmentsdata(this.id, this.name, this.pageSize, 1)
      .subscribe(
        (res: any) => {
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          var headerList = [];
          for (var k in JSON.parse(decodedEquipments)[0]) {
            headerList.push(k);
          }
          if (headerList.length >= 8) {
            this.moreRows = true;
          } else {
            this.moreRows = false;
          }
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
          this.length = res.totalRecords;
          this.paginator.pageIndex = 0;
          this.paginator.pageSize = this.pageSize;
          this._equipLoading = false;
          this.displayedrows = this.makeTableRows(this.dataSource);
        },
        (err) => {
          this._equipLoading = false;
          console.log('There was an error while retrieving Posts !!!' + err);
        }
      );
  }
  getPaginatorData(event) {
    this._equipLoading = true;
    this.dataSource = null;
    this.displayedrows = [];
    const page_num = event.pageIndex;
    this.current_page_num = page_num + 1;
    this.length = event.length;
    this.pageSize = event.pageSize;
    const searchFilter = this.getSearchParams(this.searchFields);
    this.sort_order = this.sort.direction;
    this.sort_by = this.sort.active;
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
      this.sort_by = this.name;
    }
    this.equipmentTypeManagementService
      .getEquipmentDataWithFilters(
        this.id,
        this.pageSize,
        page_num + 1,
        this.sort_order,
        this.sort_by,
        '',
        '',
        '',
        searchFilter
      )
      .subscribe(
        (res: any) => {
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
          this.length = res.totalRecords;
          this._equipLoading = false;
          this.displayedrows = this.makeTableRows(this.dataSource);
        },
        (error) => {
          this._equipLoading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        }
      );
  }
  applyFilter() {
    this._equipLoading = true;
    this.dataSource = null;
    this.displayedrows = [];
    const searchFilter = this.getSearchParams(this.searchFields);
    this.sort_order = this.sort.direction;
    this.sort_by = this.sort.active;
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
      this.sort_by = this.name;
    }
    this.equipmentTypeManagementService
      .filteredData(
        this.id,
        this.current_page_num,
        this.pageSize,
        this.sort_by,
        this.sort_order,
        searchFilter
      )
      .subscribe(
        (res: any) => {
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
          this.length = res.totalRecords;
          this._equipLoading = false;
          this.displayedrows = this.makeTableRows(this.dataSource);
        },
        (error) => {
          this._equipLoading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        }
      );
  }
  sortData(event) {
    this._equipLoading = true;
    this.dataSource = null;
    this.displayedrows = [];
    const searchFilter = this.getSearchParams(this.searchFields);
    this.sort_order = this.sort.direction;
    this.sort_by = this.sort.active;
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
      this.sort_by = this.name;
    }
    this.equipmentTypeManagementService
      .getEquipmentDataWithFilters(
        this.id,
        this.pageSize,
        this.current_page_num,
        this.sort_order,
        this.sort_by,
        '',
        '',
        '',
        searchFilter
      )
      .subscribe(
        (res: any) => {
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
          this.length = res.totalRecords;
          this._equipLoading = false;
          this.displayedrows = this.makeTableRows(this.dataSource);
        },
        (error) => {
          this._equipLoading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        }
      );
  }

  openDialog(ele, x): void {
    const dialogRef = this.dialog.open(AttributeDetailComponent, {
      width: '1600px',
      maxHeight: '550px',
      disableClose: true,
      data: {
        typeId: ele.ID,
        typeName: ele[x],
        equipName: this.equipName,
        equiId: this.equiId,
        types: this.allType,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
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
        Object.keys(dataSource[i]).forEach((key) => {
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
    let searchFilter;
    if (Object.keys(obj).length > 0) {
      searchFilter = 'search_params=';
      Object.keys(obj).forEach((key) => {
        if (obj[key]) {
          if (searchFilter === 'search_params=') {
            searchFilter += key + '=' + obj[key]?.trim();
          } else {
            searchFilter += ',' + key + '=' + obj[key]?.trim();
          }
        }
      });
    }
    return searchFilter;
  }

  advSearchTrigger(event) {
    this.searchFields = event;
    this.applyFilter();
  }
}

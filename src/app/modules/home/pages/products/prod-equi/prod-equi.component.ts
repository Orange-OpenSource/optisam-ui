// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild,  } from '@angular/core';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { AttributeDetailComponent } from '../../equipments/attribute-detail/attribute-detail.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';



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
  instanceID: String;
  filterGroup: FormGroup;
  appId: any;
  path: any;
  _loading: Boolean;
  _equipLoading: Boolean;
  moreRows:Boolean;
  activeLink:any;
  appName:String;
  prodFilterKey:String;
  aplFilterKey:String;
  instFilterKey:String;

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
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  swidTag: String;

  ngOnInit() {
    this.productName = localStorage.getItem('prodName');
    this.instanceID = localStorage.getItem('instanceID');
    this.appName = localStorage.getItem('appName');
    this.swidTag = (this.route.snapshot.paramMap.get('swidTag'));
    this.appId = localStorage.getItem('key');
    if(this.route.snapshot.routeConfig){
      this.path = this.route.snapshot.routeConfig.path;
    }
    switch(this.path) {
      case 'applications/:key/:swidTag':
        this.prodFilterKey = this.swidTag;
        this.aplFilterKey = this.appId;
        this.instFilterKey = '';
        break;
      case 'instances/:app_id/:inst_id':
        this.prodFilterKey = '';
        this.aplFilterKey = this.appId;
        this.instFilterKey = this.instanceID;
        break;
      case 'products/equi/:swidTag':
        this.prodFilterKey = this.swidTag;;
        this.aplFilterKey = '';
        this.instFilterKey = '';
        break;
      case 'apl/instances/:swidTag/:app_id/:inst_id':
        this.prodFilterKey = this.swidTag;
        this.aplFilterKey = this.appId;
        this.instFilterKey = this.instanceID;
        break;
      default:
        this.prodFilterKey = '';
        this.aplFilterKey = '';
        this.instFilterKey = '';

    }
    this.filterGroup = new FormGroup({});
    this._loading = true;
    this.equipmentTypeManagementService.getTypes().subscribe(
      (res: any) => {
        this.allType = (res.equipment_types||[]).reverse();
        this.MyDataSource = new MatTableDataSource(res.equipment_types);
        this.displayedColumns = [];
        const filteredData: any = this.MyDataSource.filteredData;
        this.displayedColumns2 = filteredData;
        this.MyDataSource.sort = this.sort;
        for (const pdata of filteredData) {
          this.displayedColumns.push(pdata.type);
        }
        this.getEquipmentsData(this.displayedColumns2[0]);
        this.activeLink = this.displayedColumns2[0].type;
        this._loading = false;
      },
      (err) => {
        this._loading = false;
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

    this._equipLoading = true;
    this.dataSource = null;
    this.displayedrows = [];
      this.equipmentTypeManagementService.getEquipmentDataWithFilters(this.id, 10, 1,'asc', this.name, this.prodFilterKey, this.aplFilterKey, this.instFilterKey).subscribe(
        (res:any) => {
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
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
          this._equipLoading = false;
        },
        error => {
          this._equipLoading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        });
  }
  getPaginatorData(event) {
    const sort_by = this.name;
    const key = this.id;
    const page_num = event.pageIndex;
    this.current_page_num = page_num + 1;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this._equipLoading = true;
    const searchFilter = this.getSearchParams(this.searchFields);
    this.dataSource = null;
    this.displayedrows = [];

    this.equipmentTypeManagementService.getEquipmentDataWithFilters(this.id, this.pageSize, page_num + 1, 'asc', sort_by, this.prodFilterKey, this.aplFilterKey, this.instFilterKey, searchFilter)
    .subscribe(
      (res: any) => {
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
        this._equipLoading = false;
      },
      error => {
        this._equipLoading = false;
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
    this._equipLoading = true;
    const searchFilter = this.getSearchParams(this.searchFields);
    const sort_by = this.name;
    this.sort_order = localStorage.getItem('list_direction');
    this.sort_by = localStorage.getItem('list_active');
    this.dataSource = null;
    this.displayedrows = [];
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.equipmentTypeManagementService.getEquipmentDataWithFilters(this.id, this.pageSize, this.current_page_num,'asc', this.name, this.prodFilterKey, this.aplFilterKey, this.instFilterKey, searchFilter)
      .subscribe(
        (res: any) => {
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
          this._equipLoading = false;
        },
        error => {
          this._equipLoading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        });
  }
  sortData(event) {
    const key = this.id;
    this._equipLoading = true;
    localStorage.setItem('list_direction', event.direction);
    localStorage.setItem('list_active', event.active);
    const searchFilter = this.getSearchParams(this.searchFields);
    this.dataSource = null;
    this.displayedrows = [];
    this.equipmentTypeManagementService.getEquipmentDataWithFilters(this.id, this.pageSize, this.current_page_num,event.direction, event.active, this.prodFilterKey, this.aplFilterKey, this.instFilterKey,searchFilter)
      .subscribe(
        (res: any) => {
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
          this._equipLoading = false;
        },
        error => {
          this._equipLoading = false;
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
  }


  clearFilter() {
    this.filterGroup.reset();
    this.applyFilter();
   }

   advSearchTrigger(event) {
    this.searchFields = event;
    this.applyFilter();
  }
  backToProductsPage() {
    const filters = JSON.parse(localStorage.getItem('prodFilter'));
    this.router.navigateByUrl('/optisam/pr/products', { state : { name : filters['name'], swidTag: filters['swidTag'], editor: filters['editor']} })
  }
  backToApplicationsPage() {
    const filters = JSON.parse(localStorage.getItem('aplFilter'));
    this.router.navigate(['/optisam/apl/applications'], { state : { appName: filters['appName'], owner: filters['owner'], domain: filters['domain'], risk: filters['risk'] }});
  }
}

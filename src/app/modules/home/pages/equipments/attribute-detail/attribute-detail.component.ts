// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Inject, ViewChild, SystemJsNgModuleLoader } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { FormGroup, FormControl } from '@angular/forms';
/*  import { DialogData } from './details'; */

@Component({
  selector: 'app-attribute-detail',
  templateUrl: './attribute-detail.component.html',
  styleUrls: ['./attribute-detail.component.scss']
})
export class AttributeDetailComponent implements OnInit {

  page_size: any;
  pageEvent: any;
  equiDetails: any;
  disCol: any;
  equiObj: any;
  keyArr = [];
  valueArr = [];
  MyDataSource: MatTableDataSource<{}>;
  typeId: String;
  equimId: String;
  parentDetail: any;
  childDetail: any;
  childrentTypeIdArr = [];
  childrenId: String;
  reuseKeyName = [];
  reuseValueName = [];
  type;
  productStatus: Boolean;
  parentDisplay: Boolean;
  childDisplay: Boolean;
  parentId: any;
  childRefrenceArr = [];
  childHeader = [];
  displayedColumns = [];
  displayedColumns2 = [];
  displayedrows = [];
  dataSource: any;
  childRefId;
  length;
  pageSize = 10;
  current_page_num = 1;
  product_curr_num = 1;
  productPageSize = 10;
  SortName: String;
  filterGroup: FormGroup;
  productColumn = [];
  productdataSource: any;
  saveSelectedSWIDTag;
  saveSelectedPName;
  saveSelectedEditor;
  productsort_order = 'ASC';
  productsort_by = '';
  productLength;
  sort_order: String = 'ASC';
  productStartPageNum;
  filteringOrder: any;
  swidtagPlaceholder: any;
  productnamePlaceholder: any;
  EditorNamePlaceholder: any;
  defaultSearchName;
  equipName;
  sName = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  advanceSearchModel: any = {
    title: 'Search by Product Name',
    primary: 'productName',
    other: [
      { key: 'swidTag', label: 'SWIDtag' },
      { key: 'productName', label: 'Product name' },
      { key: 'editorName', label: 'Editor name' }
    ]
  };
  searchFields: any = {};

  /*
     productdetails: DialogData = new DialogData();  */
  constructor(public equipmentTypeManagementService: EquipmentTypeManagementService,
    public dialogRef: MatDialogRef<AttributeDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }


  ngOnInit() {
    this.filterGroup = new FormGroup({});
    this.typeId = this.data['typeId'];
    this.equimId = this.data['equiId'];
    this.type = this.data['types'];
    this.equipName = this.data['equipName'];
    for (let i = 0; i <= this.type.length - 1; i++) {
      if (this.type[i].ID === this.equimId) {
        this.parentId = this.type[i].ID;
        const ObjKey = Object.keys(this.type[i]);
        if (ObjKey.includes('parent_id')) {
          this.parentDisplay = false;
        } else {
        this.parentDisplay = true;
        }
      }
    }
    this.childRefrenceArr = [];
    for (let i = 0; i <= this.type.length - 1; i++) {
      const ObjKey = Object.keys(this.type[i]);
      if (ObjKey.includes('parent_id')) {
        if (this.type[i].parent_id === this.parentId) {
          this.childRefrenceArr.push(this.type[i]);
          // this.childDisplay = false;

        }


      }
    }

    this.equipmentTypeManagementService.getEquipmentDetail(this.equimId, this.typeId).subscribe(
      (res: any) => {
        this.equiObj = JSON.parse(res.equipment);
        this.keyArr = Object.keys(this.equiObj);
        this.valueArr = Object.values(this.equiObj);
        this.keyArr.shift();
        this.valueArr.shift();
        this.MyDataSource = new MatTableDataSource(this.childRefrenceArr);
        //  this.getParent();
      },
      error => {
        //   console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  getParent(): void {
    this.equipmentTypeManagementService.getParentDetail(this.equimId, this.typeId).subscribe(
      (res: any) => {
        const decodedEquipments: any = atob(res.equipments);
        const parentObj = JSON.parse(decodedEquipments);
        for (let k = 0; k <= parentObj.length - 1; k++) {
          const keyObj = Object.keys(parentObj[k]);
          for (let l = 0; l <= keyObj.length - 1; l++) {
            if (this.reuseKeyName.includes(keyObj[l])) {
              this.reuseKeyName.push(keyObj[l]);
            }
          }
        }
        this.reuseKeyName = Object.keys(parentObj[0]);
        this.reuseKeyName.shift();
        this.reuseValueName = parentObj;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });

  }
  tabClick(tab) {
  }
  getFilterData(testData: any): string {
    return testData.filteredData;
  }
  getChild(obj): void {
    this.productStatus = true;
    this.filterGroup.reset();
    this.childRefId = '';
    const length = 1;
    const pageSize = 10;
    const sortBy = this.SortName;
    const sortOrder = 'ASC';
    this.childRefId = obj.ID;
    this.equipmentTypeManagementService.getChildDetail(this.equimId, this.typeId, obj.ID, length, pageSize, sortBy, sortOrder).subscribe(
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
          console.log('this.dataSource[0]=--', this.dataSource[0]);
          // tslint:disable-next-line:forin
          for (const x in this.dataSource[0]) {
            this.displayedrows.push(x);
            this.filterGroup.addControl(x, new FormControl(null));
          }
          this.dataSource[0].ID = idValue;
          console.log('displayedrows-------', this.displayedrows);
        }
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  /* */
  getPaginatorData(event) {
    const sort_by = this.SortName;
    this.sort_order = event.direction;
    const page_num = event.pageIndex;
    this.current_page_num = page_num;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.equipmentTypeManagementService.getChildPaginatedData(this.equimId, this.typeId, this.childRefId,
      page_num + 1, this.pageSize, sort_by).subscribe(
        (res: any) => {
          this.displayedrows = [];
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
          this.length = res.totalRecords;
          if (this.dataSource.length > 0) {
            delete this.dataSource[0].ID;
            // tslint:disable-next-line:forin
            for (const x in this.dataSource[0]) {
              this.displayedrows.push(x);
            }
          }
        },
        error => {
          console.log('There was an error while retrieving Posts !!!' + error);
        });
  }

  sortData(event) {
    this.sort_order = event.direction;
    this.SortName = event.active;
    this.equipmentTypeManagementService.sortChildEquipments(this.equimId, this.typeId, this.childRefId, this.current_page_num, this.pageSize,
      event.active, event.direction).subscribe(
        (res: any) => {
          this.displayedrows = [];
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
          this.length = res.totalRecords;
          if (this.dataSource.length > 0) {
            delete this.dataSource[0].ID;
            // tslint:disable-next-line:forin
            for (const x in this.dataSource[0]) {
              this.displayedrows.push(x);
            }
          }
        },
        error => {
          console.log('There was an error while retrieving Posts !!!' + error);
        });
  }
  getchildRef(): void {
    const Obj = this.childRefrenceArr[0];
    for (let i = 0; i <= Obj.attributes.length - 1; i++) {
      const keName = Object.keys(Obj.attributes[i]);
      if (keName.includes('primary_key')) {
        if (Obj.attributes[i].primary_key === true) {
          this.SortName = Obj.attributes[i].name;
        }
      }

    }
    this.getChild(Obj); // g

  }

  getProduct(): void {
    const length = 1;
    this.productStatus = true;
    const pageSize = 10;
    const sortBy = 'SWID_TAG';
    this.equipmentTypeManagementService.getProductDetail(this.equimId, this.typeId, length, pageSize, sortBy).subscribe(
      (res: any) => {
        this.productColumn = ['swidTag', 'name', 'editor', 'version'];
        this.productdataSource = new MatTableDataSource(res.products);
        this.productdataSource.sort = this.sort;
        this.productLength = res.totalRecords;
        this.productStatus = false;

      },
      error => {
        this.productStatus = true;
        console.log('There was an error while retrieving Posts !!!' + error);
      });


  }
  productSortData(sort) {
    /*   localStorage.setItem('product_direction', sort.direction);
      localStorage.setItem('product_active', sort.active); */
    this.productsort_order = sort.direction;
    this.productsort_by = sort.active;
    if (sort.active.toUpperCase() === 'SWIDTAG') {
      this.productsort_by = 'SWID_TAG';
    }
    this.equipmentTypeManagementService.productFilteredData(this.equimId, this.typeId, this.product_curr_num, this.productPageSize,
      this.productsort_by, sort.direction, this.searchFields.swidTag, this.searchFields.productName, this.searchFields.editorName).subscribe(
        (res: any) => {
          this.productdataSource = new MatTableDataSource(res.products);
          this.productdataSource.sort = this.sort;
        },
        error => {
          console.log('There was an error while retrieving Posts !!!' + error);
        });
  }
  getProductPaginatorData(event) {
    const page_num = event.pageIndex;
    this.current_page_num = page_num;
    this.product_curr_num = event.length;
    this.productPageSize = event.pageSize;
    /*   this.productsort_order = localStorage.getItem( 'product_direction');
      this.productsort_by = localStorage.getItem( 'product_active'); */
    if (this.productsort_by === '' || this.productsort_by === null) {
      this.productsort_by = 'SWID_TAG';
    }
    if (this.productsort_order === '' || this.productsort_order === null) {
      this.productsort_order = 'ASC';
    }
    this.equipmentTypeManagementService.productFilteredData(this.equimId, this.typeId, page_num + 1, this.productPageSize,
      this.productsort_by, this.productsort_order, this.searchFields.swidTag, this.searchFields.productName, this.searchFields.editorName).subscribe(
        (res: any) => {
          this.productdataSource = new MatTableDataSource(res.products);
          this.productdataSource.sort = this.sort;
        }
      );
  }
  setSelected(param: string, value: number) {
    if (value === 1) {
      this.saveSelectedSWIDTag = param;
      this.productsort_by = 'SWID_TAG';
    }
    if (value === 2) {
      this.saveSelectedPName = param;
      this.productsort_by = 'NAME';
    }
    if (value === 3) {
      this.saveSelectedEditor = param;
      this.productsort_by = 'EDITOR';
    }
  }
  setSelectedSearch(param: string, value: number) {
    if (value === 1) {
      this.saveSelectedSWIDTag = param;
      this.productsort_by = 'SWID_TAG';
    }
    if (value === 2) {
      this.saveSelectedPName = param;
      this.productsort_by = 'NAME';
    }
    if (value === 3) {
      this.saveSelectedEditor = param;
      this.productsort_by = 'EDITOR';
    }
  }
  setChildSearch(param: string, value: number) {
    if (value === 2) {
      this.defaultSearchName = param;
      console.log('defaultSearchName------', this.defaultSearchName);
    }
    if (value === 3) {
      this.defaultSearchName = null;
      console.log('defaultSearchName------', this.defaultSearchName);
    }
  }
  applyFilter() {
    /*   this.productsort_order = localStorage.getItem('product_direction');
      this.productsort_by = localStorage.getItem('product_active'); */
    if (this.productsort_by === '' || this.productsort_by === null) {
      this.productsort_by = 'SWID_TAG';
    }
    if (this.productsort_order === '' || this.productsort_order === null) {
      this.productsort_order = 'ASC';
    }
    if (this.product_curr_num === 0) {
      this.product_curr_num = 1;
    }
    this.equipmentTypeManagementService.productFilteredData(this.equimId, this.typeId, this.product_curr_num, this.productPageSize,
      this.productsort_by, this.productsort_order, this.searchFields.swidTag, this.searchFields.productName, this.searchFields.editorName).subscribe(
        (res: any) => {
          const testData = new MatTableDataSource(res.products);
          this.productdataSource = new MatTableDataSource(res.products);
          this.productdataSource.sort = this.sort;
          this.productLength = res.totalRecords;
          this.length = res.totalRecords;
        }
      );
  }
  clearFilter() {
    ///  this.filterGroup.reset();
    this.saveSelectedSWIDTag = undefined;
    this.saveSelectedEditor = undefined;
    this.saveSelectedPName = undefined;
    this.swidtagPlaceholder = null;
    this.productnamePlaceholder = null;
    this.EditorNamePlaceholder = null;
    this.applyFilter();
  }
  applyChildFilter() {
    let searchFilter = 'search_params=';
    /*   if (this.defaultSearchName === '' || this.defaultSearchName === null) { */
    for (const key in this.filterGroup.value) {
      if (this.filterGroup.value[key]) {
        if (searchFilter === 'search_params=') {
          searchFilter += key + '=' + this.filterGroup.value[key];
        } else {
          searchFilter += ',' + key + '=' + this.filterGroup.value[key];
        }
      }
    }
    /*}  else {
      searchFilter = 'search_params=' + this.SortName + '=' + this.defaultSearchName ;
    } */

    const sort_by = this.SortName;
    // this.sort_order = this.sort_order;
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'ASC';
    }
    if (this.current_page_num === 0) {
      this.current_page_num = 1;
    }
    this.equipmentTypeManagementService.sortFilterChildEquipments(this.equimId, this.typeId, this.childRefId, this.current_page_num,
      this.pageSize, sort_by, this.sort_order, searchFilter).subscribe(
        (res: any) => {
          this.displayedrows = [];
          const encodedEquipments = res.equipments;
          const decodedEquipments: any = atob(encodedEquipments);
          const testData = new MatTableDataSource(decodedEquipments);
          this.dataSource = JSON.parse(this.getFilterData(testData));
          this.length = res.totalRecords;
          if (this.dataSource.length > 0) {
            delete this.dataSource[0].ID;
            // tslint:disable-next-line:forin
            for (const x in this.dataSource[0]) {
              this.displayedrows.push(x);
            }
          }
        }
      );
  }
  clearChildFilter() {
    //  this.setChildSearch('test', 3);
    //  this.defaultSearchName = null;
    this.filterGroup.reset();
    this.applyChildFilter();
  }

  advSearchTrigger(event) {
    // console.log('trigger event => ', event);
    this.searchFields = event;
    this.applyFilter();
  }
}

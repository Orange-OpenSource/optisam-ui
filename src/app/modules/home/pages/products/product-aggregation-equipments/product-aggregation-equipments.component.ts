// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-aggregation-equipments',
  templateUrl: './product-aggregation-equipments.component.html',
  styleUrls: ['./product-aggregation-equipments.component.scss']
})
export class ProductAggregationEquipmentsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  advanceSearchModel: any = {
    title: '',
    primary: '',
    other: []
  };
  searchFields: any = {};
  equipmentTypes: any[];
  selectedEquipment: any;
  pageSize: number;
  current_page_num: number;
  searchQuery: string;
  sortQuery: string;
  aggregationName: string;
  dataSource: MatTableDataSource<any>;
  displayedrows: string[];
  length: number;
  _loading:Boolean;

  constructor(
    private router: ActivatedRoute,
    private equipmentTypeManagementService: EquipmentTypeManagementService,
  ) {
    this.aggregationName = this.router.snapshot.params.agg_name;
    this.pageSize = 10;
    this.current_page_num = 1;
  }

  ngOnInit() {
    this._loading = true;
    this.equipmentTypeManagementService.getAllTypes().subscribe(
      (res: any) => {
        // this.allType = res.equipment_types;
        this.equipmentTypes = res.equipment_types || [];
        const MyDataSource = new MatTableDataSource(res.equipment_types);
        console.log('res.equipment_types-----', res.equipment_types, MyDataSource.filteredData);
        this.selectEquipment(this.equipmentTypes[0]);
        this._loading = false;
        /* this.MyDataSource = new MatTableDataSource(res.equipment_types);
        this.displayedColumns = [];
        const filteredData: any = this.MyDataSource.filteredData;
        this.displayedColumns2 = filteredData;
        this.MyDataSource.sort = this.sort;
        for (const pdata of filteredData) {
          this.displayedColumns.push(pdata.type);
        }
        this.getEquipmentsData(this.displayedColumns2[0]); */
      });
  }

  selectEquipment(equipType: any) {
    this.selectedEquipment = equipType;
    this.current_page_num = 1;

    // Reset Advance search
    this.searchFields = {};
    this.advanceSearchModel = {
      title: '',
      primary: '',
      other: []
    };

    // Dynamically fill advance search fields
    for (const filter of equipType.attributes) {
      if (filter.searchable) {
        if (filter.primary_key) {
          this.advanceSearchModel.title = 'Search by ' + filter.name;
          this.advanceSearchModel.primary = filter.name;
        }
        this.advanceSearchModel.other.push({key: filter.name, label: filter.name});
      }
    }
    this.getEquipmentsData();
  }

  getSearchParams() {
    let params = 'search_params=';
    for (const key in this.searchFields) {
      if (this.searchFields[key]) {
        if (params === 'search_params=') {
          params += key + '=' + this.searchFields[key];
        } else {
          params += ',' + key + '=' + this.searchFields[key];
        }
      }
    }
    return params;
  }

  applyFilter() {
    this.sortQuery = 'sort_order=asc&sort_by=' + this.advanceSearchModel.primary;
    this.current_page_num = 1;
    this.getEquipmentsData();
  }

  getEquipmentsData() {
    this._loading = true;
    let query = '?page_size=' + this.pageSize + '&page_num=' + this.current_page_num;
    query += '&' + this.getSearchParams();
    query += (this.sortQuery ? '&' + this.sortQuery : '&sort_order=asc&sort_by=' + this.advanceSearchModel.primary);
    this.equipmentTypeManagementService.getAggregationEquipments(query, this.aggregationName, this.selectedEquipment.ID).subscribe((res) => {
      const decodedData = JSON.parse(atob(res.equipments));
      this.dataSource = new MatTableDataSource(decodedData);
      this.length = res.totalRecords || 0;
      this.displayedrows = decodedData[0] ? Object.keys(decodedData[0]).filter(d => d !== 'ID') : [];
      this._loading = false;
    }, err => {
      this._loading = false;
      console.log('Error => ', err.error);
    });
  }

  sortData(event: any) {
    console.log('sort', event);
    this.sortQuery = 'sort_order=' + event.direction + '&sort_by=' + event.active;
    this.getEquipmentsData();
  }

  getPaginatorData(event: any) {
    console.log('paginate', event);
    this.current_page_num = event.pageIndex + 1;
    // this.length = event.length;
    this.pageSize = event.pageSize;
    this.getEquipmentsData();
  }

  advSearchTrigger(event) {
    // console.log('trigger event => ', event);
    this.searchFields = event;
    this.applyFilter();
  }
}

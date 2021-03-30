// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, ViewChild } from '@angular/core';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AttributeDetailComponent } from '../../equipments/attribute-detail/attribute-detail.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-product-aggregation-equipments',
  templateUrl: './product-aggregation-equipments.component.html',
  styleUrls: ['./product-aggregation-equipments.component.scss']
})
export class ProductAggregationEquipmentsComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  advanceSearchModel: any = {
    title: '',
    primary: '',
    other: []
  };
  searchFields: any = {};
  equipmentTypes: any[];
  selectedEquipment: any;
  pageSize: number;
  pageEvent: any;
  current_page_num: number;
  searchQuery: string;
  sortQuery: string;
  aggregationName: string;
  dataSource: MatTableDataSource<any>;
  displayedrows: string[]=[];
  length: number;
  _loading:Boolean;
  _equipLoading:Boolean;
  activeLink:any;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private equipmentTypeManagementService: EquipmentTypeManagementService,
  ) {
    if (this.route.snapshot.params) {
      this.aggregationName = this.route.snapshot.params.agg_name;
    }
    this.pageSize = 10;
    this.current_page_num = 1;
  }

  ngOnInit() {
    this._loading = true;
    this.equipmentTypeManagementService.getTypes().subscribe(
      (res: any) => {
        this.equipmentTypes = (res.equipment_types || []).reverse();
        const MyDataSource = new MatTableDataSource(res.equipment_types);
        this.selectEquipment(this.equipmentTypes[0]);
        this._loading = false;
        this.activeLink = this.equipmentTypes[0].type;
      },
      (err) => {
        this._loading = false;
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
    this._equipLoading = true;
    this.dataSource = null;
    this.displayedrows = [];
    let query = '?page_size=' + this.pageSize + '&page_num=' + this.current_page_num;
    query += '&' + this.getSearchParams();
    query += (this.sortQuery ? '&' + this.sortQuery : '&sort_order=asc&sort_by=' + this.advanceSearchModel.primary);
    this.equipmentTypeManagementService.getAggregationEquipments(query, this.aggregationName, this.selectedEquipment.ID).subscribe((res) => {
      const decodedData = JSON.parse(atob(res.equipments));
      this.dataSource = new MatTableDataSource(decodedData);
      this.length = res.totalRecords || 0;
      this.displayedrows = decodedData[0] ? Object.keys(decodedData[0]).filter(d => d !== 'ID') : [];
      this._equipLoading = false;
    }, err => {
      this._equipLoading = false;
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
  openDialog(ele,x): void {
    const dialogRef = this.dialog.open(AttributeDetailComponent, {
      width: '1600px',
      maxHeight: '550px',
      disableClose: true,
      data: {
        typeId : ele.ID,
        typeName : ele[x],
        equipName: this.selectedEquipment.type,
        equiId : this.selectedEquipment.ID,
        types: this.equipmentTypes
      }
    });
  }

  goBackToAggregation() {
    const filters = JSON.parse(localStorage.getItem('prodAggrFilter'));
    this.router.navigateByUrl('/optisam/pr/products/aggregations', { state : { name : filters['name'], swidTag: filters['swidTag'], editor: filters['editor']} })
  }
}

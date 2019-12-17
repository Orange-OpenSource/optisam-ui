import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { ProductService } from 'src/app/core/services/product.service';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { AcquiredrightsService } from 'src/app/core/services/acquiredrights.service';

@Component({
  selector: 'app-productrights',
  templateUrl: './productrights.component.html',
  styleUrls: ['./productrights.component.scss']
})
export class ProductrightsComponent implements OnInit {
  public searchValue: any = {};

  MyDataSource: any;
  searchKey: string;
  swidTag: any;
  length;
  pageSize = 10;
  sort_order: any;
  sort_by: any;
  page_size: any;
  pageEvent: any;
  selected: any;
  saveSelectedSWIDTag: string;
  saveSelectedSKU: string;
  saveSelectedEditor: string;
  saveSelectedPName: string;
  saveSelectedMetric: string;
  current_page_num: any;
  filteringOrder: any;
  swidtagPlaceholder: any;
  skuPlaceholder: any;
  editorNamePlaceholder: any;
  productNamePlaceholder: String;
  metricPlaceholder: any;

  displayedColumns: string[] = ['entity',
    'SKU',
    'swid_tag',
    'product_name',
    'editor',
    'metric',
    'acquired_licenses_number',
    'licenses_under_maintenance_number',
    'avg_licenes_unit_price',
    'avg_maintenance_unit_price',
    'total_purchase_cost',
    'total_maintenance_cost',
    'total_cost'];

  advanceSearchModel: any = {
    title: 'Search by Product Name',
    primary: 'productName',
    other: [
      {key: 'swidTag', label: 'SWIDtag'},
      {key: 'sku', label: 'SKU'},
      {key: 'editorName', label: 'Editor Name'},
      {key: 'productName', label: 'Product Name'},
      {key: 'metric', label: 'Metric'}
    ]
  };
  searchFields: any = {};

  constructor(private acquiredrightservice: AcquiredrightsService, public dialog: MatDialog, private router: Router) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.current_page_num = 1;
    this.RenderDataTable();
  }
  RenderDataTable() {
    this.acquiredrightservice.getAcquiredrights(10, 1).subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.acquired_rights);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }
  getPaginatorData(event) {
    const page_num = event.pageIndex;
    this.current_page_num = page_num;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.sort_order = localStorage.getItem('acquired_direction');
    this.sort_by = localStorage.getItem('acquired_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'ENTITY';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.acquiredrightservice.filteredData(page_num + 1, this.pageSize,
      this.sort_by, this.sort_order, this.searchFields.swidTag, this.searchFields.sku,
      this.searchFields.editorName, this.searchFields.productName, this.searchFields.metric).subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.acquired_rights);
          this.MyDataSource.sort = this.sort;
        }
      );
  }
  sortData(sort) {
    localStorage.setItem('acquired_direction', sort.direction);
    localStorage.setItem('acquired_active', sort.active);
    if (this.current_page_num === 0) {
      this.current_page_num = 1;
    }
    this.acquiredrightservice.filteredData(this.current_page_num, this.pageSize,
      sort.active, sort.direction, this.searchFields.swidTag, this.searchFields.sku,
      this.searchFields.editorName, this.searchFields.productName, this.searchFields.metric).subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.acquired_rights);
          this.MyDataSource.sort = this.sort;
        },
        error => {
          console.log('There was an error while retrieving Posts !!!' + error);
        });
  }

  setSelectedSearch(param: string, value: number) {
    if (value === 1) {
      this.saveSelectedSWIDTag = param;
    }
    if (value === 2) {
      this.saveSelectedSKU = param;
    }
    if (value === 3) {
      this.saveSelectedEditor = param;
    }
    if (value === 4) {
      this.saveSelectedPName = param;
    }
    if (value === 5) {
      this.saveSelectedMetric = param;
    }
  }
  setSelected(param: string, value: number) {
    if (value === 1) {
      this.saveSelectedSWIDTag = param;
    }
    if (value === 2) {
      this.saveSelectedSKU = param;
    }
    if (value === 3) {
      this.saveSelectedEditor = param;
    }
    if (value === 4) {
      this.saveSelectedPName = param;
    }
    if (value === 5) {
      this.saveSelectedMetric = param;
    }
  }
  applyFilter() {
    this.sort_order = localStorage.getItem('acquired_direction');
    this.sort_by = localStorage.getItem('acquired_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'ENTITY';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'ASC';
    }
    if (this.current_page_num === 0 ) {
      this.current_page_num = 1;
    }
    this.acquiredrightservice.filteredData(this.current_page_num, this.pageSize,
      this.sort_by, this.sort_order, this.searchFields.swidTag, this.searchFields.sku,
      this.searchFields.editorName, this.searchFields.productName, this.searchFields.metric).subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.acquired_rights);
          this.MyDataSource.sort = this.sort;
          this.length = res.totalRecords;
        }
      );
  }
  clearFilter() {
    this.saveSelectedSWIDTag = undefined;
    this.saveSelectedSKU = undefined;
    this.saveSelectedEditor = undefined;
    this.saveSelectedPName = undefined;
    this.saveSelectedMetric = undefined;
    this.skuPlaceholder = null;
    this.swidtagPlaceholder = null;
    this.editorNamePlaceholder = null;
    this.productNamePlaceholder = null;
    this.metricPlaceholder = null;
    this.applyFilter();
  }

  advSearchTrigger(event) {
    // console.log('trigger event => ', event);
    this.searchFields = event;
    this.applyFilter();
  }
}



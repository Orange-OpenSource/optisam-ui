import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { EditAcquiredRightComponent } from '../edit-acquired-right/edit-acquired-right.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';
import { CreateAcquiredRightComponent } from '../create-acquired-right/create-acquired-right.component';

@Component({
  selector: 'app-productrights',
  templateUrl: './productrights.component.html',
  styleUrls: ['./productrights.component.scss'],
})
export class ProductrightsComponent implements OnInit {
  public searchValue: any = {};

  MyDataSource: any;
  searchKey: string;
  swidTag: any;
  length;
  pageSize = 50;
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
  _loading: Boolean;

  displayedColumns: string[] = [
    'SKU',
    'swid_tag',
    'product_name',
    'version',
    'editor',
    'metric',
    'acquired_licenses_number',
    'licenses_under_maintenance_number',
    'start_of_maintenance',
    'end_of_maintenance',
    'licenses_under_maintenance',
    'avg_licenes_unit_price',
    'avg_maintenance_unit_price',
    'total_purchase_cost',
    'total_maintenance_cost',
    'total_cost',
    'comment',
  ];

  advanceSearchModel: any = {
    title: 'Search by Product Name',
    primary: 'productName',
    other: [
      { key: 'swidTag', label: 'SWIDtag' },
      { key: 'sku', label: 'SKU' },
      { key: 'editorName', label: 'Editor Name' },
      { key: 'productName', label: 'Product Name' },
      { key: 'metric', label: 'Metric' },
    ],
  };
  searchFields: any = {};
  role = localStorage.getItem('role');

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private router: Router
  ) {}
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit() {
    this.current_page_num = 1;
    this.RenderDataTable();
  }
  RenderDataTable() {
    this._loading = true;
    this.productService
      .getAcquiredrights(this.pageSize, 1, 'SWID_TAG', 'asc')
      .subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.acquired_rights);
          this.MyDataSource.sort = this.sort;
          this.length = res.totalRecords;
          this._loading = false;
        },
        (error) => {
          console.log('There was an error while retrieving Posts !!!' + error);
        }
      );
  }
  getPaginatorData(event) {
    const page_num = event.pageIndex;
    this.current_page_num = page_num + 1;
    this._loading = true;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.sort_order = localStorage.getItem('acquired_direction');
    this.sort_by = localStorage.getItem('acquired_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'SWID_TAG';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.productService
      .filteredDataAcqRights(
        page_num + 1,
        this.pageSize,
        this.sort_by,
        this.sort_order,
        this.searchFields.swidTag?.trim(),
        this.searchFields.sku?.trim(),
        this.searchFields.editorName?.trim(),
        this.searchFields.productName?.trim(),
        this.searchFields.metric?.trim()
      )
      .subscribe((res: any) => {
        this.MyDataSource = new MatTableDataSource(res.acquired_rights);
        this.MyDataSource.sort = this.sort;
        this._loading = false;
      });
  }
  sortData(sort) {
    this._loading = true;
    localStorage.setItem('acquired_direction', sort.direction);
    localStorage.setItem('acquired_active', sort.active);
    this.productService
      .filteredDataAcqRights(
        this.current_page_num,
        this.pageSize,
        sort.active,
        sort.direction,
        this.searchFields.swidTag?.trim(),
        this.searchFields.sku?.trim(),
        this.searchFields.editorName?.trim(),
        this.searchFields.productName?.trim(),
        this.searchFields.metric?.trim()
      )
      .subscribe(
        (res: any) => {
          this.MyDataSource = new MatTableDataSource(res.acquired_rights);
          this.MyDataSource.sort = this.sort;
          this._loading = false;
        },
        (error) => {
          console.log('There was an error while retrieving Posts !!!' + error);
        }
      );
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
    this._loading = true;
    this.MyDataSource = null;
    this.sort_order = localStorage.getItem('acquired_direction');
    this.sort_by = localStorage.getItem('acquired_active');
    if (this.sort_by === '' || this.sort_by === null) {
      this.sort_by = 'SWID_TAG';
    }
    if (this.sort_order === '' || this.sort_order === null) {
      this.sort_order = 'asc';
    }
    this.productService
      .filteredDataAcqRights(
        this.current_page_num,
        this.pageSize,
        this.sort_by,
        this.sort_order,
        this.searchFields.swidTag?.trim(),
        this.searchFields.sku?.trim(),
        this.searchFields.editorName?.trim(),
        this.searchFields.productName?.trim(),
        this.searchFields.metric?.trim()
      )
      .subscribe((res: any) => {
        this.MyDataSource = new MatTableDataSource(res.acquired_rights);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      });
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
    this.searchFields = event;
    this.applyFilter();
  }

  openDialog(value, name): void {
    const dialogRef = this.dialog.open(MoreDetailsComponent, {
      width: '850px',
      disableClose: true,
      data: {
        datakey: value,
        dataName: name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}

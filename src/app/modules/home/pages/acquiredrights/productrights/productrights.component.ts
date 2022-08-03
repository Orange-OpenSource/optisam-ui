import { AcquiredRightsResponse } from './../../../../../core/modals/acquired.rights.modal';
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
import { CommonService } from '@core/services/common.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { AcquiredRightsIndividualParams } from '@core/modals/acquired.rights.modal';

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
  saveSelectedsoftwareProvider: string;
  saveSelectedorderingDate: string;
  current_page_num: any;
  filteringOrder: any;
  swidtagPlaceholder: any;
  skuPlaceholder: any;
  editorNamePlaceholder: any;
  productNamePlaceholder: String;
  metricPlaceholder: any;
  softwareProviderPlaceholder: any;
  orderingDatePlaceholder: any;
  _loading: Boolean;

  displayedColumns: string[] = [
    'SKU',
    'corporate_sourcing_contract',
    'ordering_date',
    'swid_tag',
    'product_name',
    'version',
    'editor',
    'software_provider',
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
    'last_purchased_order',
    'support_number',
    'maintenance_provider',
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
      { key: 'softwareProvider', label: 'Software Provider' },
      { key: 'orderingDate', label: 'Ordering Date', type: 'date' },
    ],
  };
  searchFields: any = {};
  role = localStorage.getItem('role');

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private router: Router,
    private cs: CommonService
  ) {}
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit() {
    this.current_page_num = 1;
    this.RenderDataTable();
  }

  get filters(): AcquiredRightsIndividualParams {
    return {
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      page_num: this.current_page_num,
      page_size: this.pageSize,
      sort_by: this.sort_by,
      sort_order: this.sort_order,
      ...(this.searchFields.swidTag?.trim() && {
        'search_params.swidTag.filteringkey': this.searchFields.swidTag?.trim(),
      }),
      ...(this.searchFields.sku?.trim() && {
        'search_params.SKU.filteringkey': this.searchFields.sku?.trim(),
      }),
      ...(this.searchFields.editorName?.trim() && {
        'search_params.editor.filteringkey':
          this.searchFields.editorName?.trim(),
      }),
      ...(this.searchFields.productName?.trim() && {
        'search_params.productName.filteringkey':
          this.searchFields.productName?.trim(),
      }),
      ...(this.searchFields.metric?.trim() && {
        'search_params.metric.filteringkey': this.searchFields.metric?.trim(),
      }),
      ...(this.searchFields.softwareProvider?.trim() && {
        'search_params.softwareProvider.filteringkey':
          this.searchFields.softwareProvider?.trim(),
      }),
      ...(this.searchFields.orderingDate && {
        'search_params.orderingDate.filteringkey':
          this.searchFields.orderingDate,
      }),
    };
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
      .filteredDataAcqRights(this.filters)
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
    this.sort_by = sort.active;
    this.sort_order = sort.direction;
    this.productService.filteredDataAcqRights(this.filters).subscribe(
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
    if (value === 6) {
      this.saveSelectedsoftwareProvider = param;
    }
    if (value === 7) {
      this.saveSelectedorderingDate = param;
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
    if (value === 6) {
      this.saveSelectedsoftwareProvider = param;
    }
    if (value === 7) {
      this.saveSelectedorderingDate = param;
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
      .filteredDataAcqRights(this.filters)
      .subscribe((res: AcquiredRightsResponse) => {
        this.MyDataSource = new MatTableDataSource(res.acquired_rights);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      }, console.log);
  }

  clearFilter() {
    this.saveSelectedSWIDTag = undefined;
    this.saveSelectedSKU = undefined;
    this.saveSelectedEditor = undefined;
    this.saveSelectedPName = undefined;
    this.saveSelectedMetric = undefined;
    this.saveSelectedsoftwareProvider = undefined;
    this.saveSelectedorderingDate = undefined;
    this.skuPlaceholder = null;
    this.swidtagPlaceholder = null;
    this.editorNamePlaceholder = null;
    this.productNamePlaceholder = null;
    this.metricPlaceholder = null;
    this.softwareProviderPlaceholder = null;
    this.orderingDatePlaceholder = null;

    this.applyFilter();
  }

  downloadFile(sku, fileName) {
    // const filePath = file.error_file_api.slice(8);
    this.productService.getDownloadFile(sku).subscribe(
      (res) => {
        console.log(res.file_data);

        const url = `data:application/pdf;base64,${res.file_data}`;

        const downloadEl = document.createElement('a');

        downloadEl.href = url;
        downloadEl.download = fileName;
        downloadEl.click();
      }
      // (error) => {
      //   this.errorMsg =
      //     error.error.message ||
      //     'Some error occured! Could not download records for selected global file';
      //   this.openModal(errorMsg);
      //   console.log('Some error occured! Could not download file.', error);
      // }
    );
  }

  advSearchTrigger(event) {
    this.searchFields = event;
    this.applyFilter();
  }

  openDialog(value, name): void {
    const dialogRef = this.dialog.open(MoreDetailsComponent, {
      width: '1300px',
      disableClose: true,
      data: {
        datakey: value,
        dataName: name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}

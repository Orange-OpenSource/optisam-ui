import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AcquiredRightsResponse } from '../../../../../core/modals/acquired-rights.modal';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { CreateAcquiredRightComponent } from '../create-acquired-right/create-acquired-right.component';
import { EditAcquiredRightComponent } from '../edit-acquired-right/edit-acquired-right.component';
import { AcquiredRightsAggregation } from '../acquired-rights.modal';
import { CreateAcquiredRightAggregationComponent } from '../create-acquired-right-aggregation/create-acquired-right-aggregation.component';
import { EditAcquiredRightAggregationComponent } from '../edit-acquired-right-aggregation/edit-acquired-right-aggregation.component';
import {
  AcquiredRightAggregationQuery,
  AcquiredRightsAggregationParams,
  AggregationGetResponse,
  GetAggregationParams,
  TableSortOrder,
} from '@core/modals';
import { CommonService } from '@core/services/common.service';
import {
  LOCAL_KEYS,
  PAGINATION_DEFAULTS,
} from '@core/util/constants/constants';
import { AcquiredRightsIndividualParams } from '@core/modals/acquired-rights.modal';
import { ShareAccquiredRightComponent } from '../share-accquired-right/share-accquired-right.component';
import { ShareAggregationComponent } from '../share-aggregation/share-aggregation.component';
import { ViewEditorDetailsAccComponent } from '../view-editor-details-acc/view-editor-details-acc.component';
// import { MatTabChangeEvent } from '@angular/material/tabs';
export interface NotLicensedProduct {
  swid_tag: string;
  product_name: string;
  version: string;
  editor: string;
}

@Component({
  selector: 'app-list-acquired-rights',
  templateUrl: './list-acquired-rights.component.html',
  styleUrls: ['./list-acquired-rights.component.scss'],
})
export class ListAcquiredRightsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  role = localStorage.getItem('role');
  currentScope = localStorage.getItem('scope');
  currentPageNum: any;
  length: any;
  pageSize: any;
  sortBy: any;
  pageEvent: any;
  sortOrder: any;
  _loading: boolean;
  myLicensedDataSource: any;
  aggregationDataSource: any;
  myNotLicensedDataSource: any;
  selectedAcqRights: any;
  selectedAggregation: any;
  _deleteInProgress: boolean;
  errorMsg: string;
  tabList: string[] = [
    'Licensed Products',
    'Not Licensed Products',
    'Licensed Aggregations',
  ];

  currentTab: string = this.tabList[0];

  advanceSearchModel: any = {
    title: 'Search by Product Name',
    primary: 'productName',
    other: [
      // { key: 'swidTag', label: 'SWIDtag' },
      { key: 'sku', label: 'SKU' },
      { key: 'editorName', label: 'Editor Name' },
      { key: 'productName', label: 'Product Name' },
      { key: 'metric', label: 'Metric' },
      // { key: 'softwareProvider', label: 'Software Provider' },
      // { key: 'orderingDate', label: 'Ordering Date', type: 'date' },
    ],
  };

  aggregationAdvanceSearchModel: any = {
    title: 'Search by Aggregation Name',
    primary: 'aggregationName',
    other: [
      { key: 'sku', label: 'SKU' },
      { key: 'editorName', label: 'Editor Name' },
      { key: 'aggregationName', label: 'Aggregation Name' },
      { key: 'metric', label: 'Metric' },
      // { key: 'softwareProvider', label: 'Software Provider' },
      // { key: 'orderingDate', label: 'Ordering Date', type: 'date' },
    ],
  };

  searchFields: any = {};
  dialogRef: any;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private router: Router,
    private cs: CommonService
  ) { }
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit() {
    this.refreshTable();
  }

  ngAfterViewInit() {
    // this.createNewAcqRightAggregation();
  }

  getAcquiredRights() {
    this._loading = true;
    this.myLicensedDataSource = new MatTableDataSource([]);
    this.productService
      .getAcquiredrights(
        this.pageSize,
        this.currentPageNum,
        this.sortBy,
        this.sortOrder
      )
      .subscribe(
        (res: any) => {
          this._loading = false;
          this.myLicensedDataSource = new MatTableDataSource(
            res.acquired_rights
          );
          this.length = res.totalRecords;
        },
        (error) => {
          this._loading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        }
      );
  }
  getNotLicensedProducts() {
    this._loading = true;
    this.productService.getProductsQualityProducts(this.currentScope).subscribe(
      (res) => {
        this.myNotLicensedDataSource = res.products_not_acquired;
        this.length = res.products_not_acquired.length;
        this._loading = false;
      },
      (err) => {
        this._loading = false;
        console.log('Some error occured! Could not get not licensed products.');
      }
    );
  }
  refreshTable() {
    this.resetPaginationProperties();
    this.getTableData();
  }

  resetPaginationProperties(): void {
    this.currentPageNum = 1;
    this.pageSize = 50;
    this.sortBy = 'SKU';
    this.sortOrder = TableSortOrder.ASC;
    this.length = null;
  }

  getTableData() {
    switch (this.currentTab) {
      case this.tabList[0]:
        this.displayedColumns = [
          'SKU',
          'product_name',
          'version',
          'editor',
          'metric',
          'acquired_licenses_number',
          'available_licenses',
          'recieved_licenses',
          'shared_licenses',
          'avg_licenes_unit_price',
          'actions',
        ];
        this.getAcquiredRights();
        break;

      case this.tabList[1]:
        this.displayedColumns = ['product_name', 'version', 'editor', 'action'];
        this.getNotLicensedProducts();
        break;
      case this.tabList[2]:
        this.displayedColumns = [
          'sku',
          'aggregation_name',
          'product_names',
          'editor',
          'metric_name',
          'swidtags',
          'num_licenses_acquired',
          'available_licenses',
          'shared_licenses',
          'recieved_licenses',
          'avg_unit_price',
          'action',
        ];
        this.getAggregation();
        break;

      default:
        break;
    }
  }

  getToolTipDataAcc(data) {
    let tooltipContent = `Available Licenses Left:${data?.available_licenses},\n Received Licenses in Current Entity:${data?.recieved_licenses},\n Shared Licenses in Current Entity:${data?.shared_licenses},\n`;
    data?.shared_data?.forEach((sl) => {
      tooltipContent += `Shared Licenses in Entity ${sl?.scope} : ${sl?.shared_licenses},\nReceived Licences from Entity ${sl?.scope}:${sl?.recieved_licenses}\n`;
    });
    return tooltipContent;
  }

  getToolTipSharedDataAcc(data) {
    let tooltipContentData = `Shared Licenses in Current Entity:${data?.shared_licenses}\n`;
    data?.shared_data?.forEach((sl) => {
      tooltipContentData += `Shared Licenses in Entity ${sl?.scope} : ${sl?.shared_licenses}\n`;
    });

    return tooltipContentData;
  }

  getToolTipReceivedDataAcc(data) {
    let tooltipContentData = `Received Licenses in Current Entity:${data?.recieved_licenses}\n`;
    data?.shared_data?.forEach((sl) => {
      tooltipContentData += `Received Licenses from Entity ${sl?.scope}:${sl?.recieved_licenses}\n`;
    });
    return tooltipContentData;
  }

  getPaginatorData(event) {
    const page_num = event.pageIndex;
    this.currentPageNum = page_num + 1;
    this.pageSize = event.pageSize;
    this.getTableData();
  }

  openEditorDialog(data: any) {
    this.dialogRef = this.dialog.open(ViewEditorDetailsAccComponent, {
      width: '1300px',
      disableClose: true,
      data: data,
    });

    this.dialogRef.afterClosed().subscribe((result) => { });
  }

  sortData(sort) {
    localStorage.setItem('acquired_direction', sort.direction);
    localStorage.setItem('acquired_active', sort.active);
    this.sortOrder = sort.direction;
    this.sortBy = sort.active;
    this.getTableData();
  }

  createNewAcqRight(data?: NotLicensedProduct) {
    //console.log(data)
    const dialogRef = this.dialog.open(CreateAcquiredRightComponent, {
      width: '850px',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: true,
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
      if (successEvent) {
        this.getTableData();
      }
    });
  }

  createNewAcqRightAggregation(data?: NotLicensedProduct) {
    const dialogRef = this.dialog.open(
      CreateAcquiredRightAggregationComponent,
      {
        width: '850px',
        maxHeight: '90vh',
        autoFocus: false,
        disableClose: true,
        data: data,
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
      if (successEvent) {
        this.getTableData();
      }
    });
  }

  shareAccquiredRight(acquired_rights) {
    console.log(acquired_rights);
    const dialogRef = this.dialog.open(ShareAccquiredRightComponent, {
      data: acquired_rights,
      width: '650px',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
      if (successEvent) {
        this.getTableData();
      }
    });
  }

  shareAggregationRight(data) {
    const dialogRef = this.dialog.open(ShareAggregationComponent, {
      data: data,
      width: '650px',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
      if (successEvent) {
        this.getAggregation();
      }
    });
  }

  editAcquiredRights(acquired_rights) {
    const dialogRef = this.dialog.open(EditAcquiredRightComponent, {
      data: acquired_rights,
      width: '850px',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
      if (successEvent) {
        this.getTableData();
      }
    });
  }

  editAggregation(aggregation: any) {
    const dialogRef = this.dialog.open(EditAcquiredRightAggregationComponent, {
      width: '850px',
      maxHeight: '90vh',
      autoFocus: false,
      disableClose: true,
      data: aggregation,
    });
    dialogRef.afterClosed().subscribe((result) => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
      if (successEvent) {
        this.getTableData();
      }
    });
  }

  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }

  deleteAcqRightsConfirmation(acquired_rights, templateRef) {
    this.selectedAcqRights = acquired_rights;
    this.openModal(templateRef, '40%');
  }

  deleteProductAcqRights(successMsg, errorMsg) {
    this._deleteInProgress = true;
    this.productService.deleteAcqRights(this.selectedAcqRights.SKU).subscribe(
      (resp) => {
        this.dialog.closeAll();
        this.openModal(successMsg, '30%');
        this._deleteInProgress = false;
      },
      (error) => {
        this.dialog.closeAll();
        this.errorMsg =
          error.error.message ||
          'Some error occured! Acquired Rights could not be deleted';
        this.openModal(errorMsg, '30%');
        this._deleteInProgress = false;
      }
    );
  }
  deleteAggregationConfirmation(aggregate: any, deleteConfirmation) {
    this.selectedAggregation = aggregate;
    this.openModal(deleteConfirmation, '40%');
  }

  deleteProductAggregation(successAggMsg, errorAggMsg) {
    this._deleteInProgress = true;
    this.productService
      .deleteLicensedAggregation(this.selectedAggregation.sku)
      .subscribe(
        (resp) => {
          this.dialog.closeAll();
          this.openModal(successAggMsg, '30%');
          this._deleteInProgress = false;
        },
        (err) => {
          this.dialog.closeAll();
          this.openModal(errorAggMsg, '30%');
          this._deleteInProgress = false;
        }
      );
  }

  openDialog(value, name, SKU): void {
    const dialogRef = this.dialog.open(MoreDetailsComponent, {
      width: '850px',
      disableClose: true,
      data: {
        datakey: value,
        dataName: name,
        dataSKU: SKU,
      },
    });
  }

  getAggregation(data?: AcquiredRightsAggregationParams): void {
    this._loading = true;
    this.aggregationDataSource = new MatTableDataSource([]);
    const paramObj: AcquiredRightsAggregationParams = data || {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      page_num: this.currentPageNum,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
    };
    this.productService.getAcqRightsAggregations(paramObj).subscribe(
      ({ aggregations, totalRecords }: AggregationGetResponse) => {
        this.aggregationDataSource = new MatTableDataSource(aggregations);
        this.length = totalRecords;
        this._loading = false;
      },
      (error) => {
        this._loading = false;
        console.log('There was an error while retrieving Data !!!' + error);
      }
    );
  }
  createNewAggregation(): void {
    alert('create new aggregation');
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

  downloadAggregationFile(sku, fileName) {
    // const filePath = file.error_file_api.slice(8);
    this.productService.getAggregationDownloadFile(sku).subscribe(
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

  checkForTabChange(change: boolean): void {
    change && this.resetPaginationProperties();
  }

  advSearchTrigger(event) {
    this.searchFields = event;
    this.currentPageNum = 1;
    this.applyFilter();
  }

  aggregationAdvSearchTrigger(event) {
    this.searchFields = event;
    this.currentPageNum = 1;
    this.applyAggFilter();
  }

  applyAggFilter(): void {
    this._loading = true;
    this.sortOrder = this.sortOrder || PAGINATION_DEFAULTS.sortOrder;
    this.sortBy = this.sortBy || 'SKU';
    // const params: AcquiredRightAggregationQuery = this.filters;
    this.getAggregation(this.aggFilters);
  }

  applyFilter(): void {
    this._loading = true;
    this.myLicensedDataSource = null;
    this.sortOrder = localStorage.getItem('acquired_direction');
    this.sortBy = localStorage.getItem('acquired_active');
    if (!this.sortBy) {
      this.sortBy = 'SWID_TAG';
    }
    if (!this.sortOrder) {
      this.sortOrder = 'asc';
    }
    console.log(this.filters);
    this.productService
      .filteredDataAcqRights(this.filters)
      .subscribe((res: AcquiredRightsResponse) => {
        this.myLicensedDataSource = new MatTableDataSource(res.acquired_rights);
        this.myLicensedDataSource.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      }, console.log);
  }

  get filters(): AcquiredRightsIndividualParams {
    return {
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      page_num: this.currentPageNum,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,

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

  get aggFilters(): AcquiredRightsAggregationParams {
    return {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      page_num: this.currentPageNum,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
      ...(this.searchFields.aggregationName?.trim() && {
        'search_params.name.filteringkey':
          this.searchFields.aggregationName?.trim(),
      }),
      ...(this.searchFields.sku?.trim() && {
        'search_params.SKU.filteringkey': this.searchFields.sku?.trim(),
      }),
      ...(this.searchFields.editorName?.trim() && {
        'search_params.editor.filteringkey':
          this.searchFields.editorName?.trim(),
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

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}

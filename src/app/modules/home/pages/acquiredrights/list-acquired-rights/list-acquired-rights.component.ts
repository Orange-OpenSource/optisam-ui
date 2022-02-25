import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    'Aggregations',
  ];
  currentTab: string = this.tabList[0];

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private router: Router
  ) {}
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
    this.productService
      .getAcquiredrights(
        this.pageSize,
        this.currentPageNum,
        this.sortBy,
        this.sortOrder
      )
      .subscribe(
        (res: any) => {
          this.myLicensedDataSource = new MatTableDataSource(
            res.acquired_rights
          );
          this.length = res.totalRecords;
          this._loading = false;
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
    this.currentPageNum = 1;
    this.pageSize = 50;
    this.sortBy = 'SWID_TAG';
    this.sortOrder = 'asc';
    this.length = null;
    this.getTableData();
  }
  getTableData() {
    switch (this.currentTab) {
      case this.tabList[0]:
        this.displayedColumns = [
          'SKU',
          'swid_tag',
          'product_name',
          'version',
          'editor',
          'metric',
          'acquired_licenses_number',
          'avg_licenes_unit_price',
          'action',
        ];
        this.getAcquiredRights();
        break;

      case this.tabList[1]:
        this.displayedColumns = [
          'swid_tag',
          'product_name',
          'version',
          'editor',
          'action',
        ];
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
          'avg_unit_price',
          'action',
        ];
        this.getAggregation();
        break;

      default:
        break;
    }
  }
  getPaginatorData(event) {
    const page_num = event.pageIndex;
    this.currentPageNum = page_num + 1;
    this.pageSize = event.pageSize;
    this.getTableData();
  }

  sortData(sort) {
    this.sortOrder = sort.direction;
    this.sortBy = sort.active;
    this.getTableData();
  }

  createNewAcqRight(data?: NotLicensedProduct) {
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

  // deleteAggregation(aggregate: any) {
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     width: '500px',
  //     autoFocus: false,
  //     disableClose: true,
  //     data: {
  //       title : 'Delete Aggregation',
  //       content : 'Are you sure you want to delete this aggregation ',
  //       type: 'deleteProductAggregate',
  //       id: aggregate.ID
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // this.getAggregations();
  //     }
  //   });
  // }

  deleteProductAggregation(successAggMsg, errorAggMsg) {
    this._deleteInProgress = true;
    this.productService
      .deleteAggregation(this.selectedAggregation.ID)
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

  openDialog(value, name): void {
    const dialogRef = this.dialog.open(MoreDetailsComponent, {
      width: '850px',
      disableClose: true,
      data: {
        datakey: value,
        dataName: name,
      },
    });
  }

  getAggregation(): void {
    this._loading = true;
    this.productService.getAggregations().subscribe(
      (res: AcquiredRightsAggregation) => {
        this.aggregationDataSource = new MatTableDataSource(res.aggregations);
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

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}

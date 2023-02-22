import { EditorProductsDialogComponent } from './../editor-products-dialog/editor-products-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import {
  Editor,
  PaginationEvent,
  ProductCatalogManagementEditorListParams,
  TableSortOrder,
} from '@core/modals';
import { ProductCatalogService } from '@core/services/product-catalog.service';
import { PRODUCT_CATALOG_TABS } from '@core/util/constants/constants';
import { ProductListComponent } from '../../products/product-list/product-list.component';
import { EditorViewComponent } from '../editor-view/editor-view.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-editor-list',
  templateUrl: './editor-list.component.html',
  styleUrls: ['./editor-list.component.scss'],
})
export class EditorListComponent implements OnInit {
  _loading: boolean = true;
  selectedProducts: any;
  currentPageNum: number = 1;
  pageSizeOptions: number[] = [50, 100, 200];
  pageSize: number = this.pageSizeOptions[0];
  length: number;
  sortOrder: string = 'asc';
  sortBy: string = 'name';
  displayedColumns: string[];
  pageEvent: any;
  dataSource: MatTableDataSource<Editor>;
  partnersArrayName: string[] = [];
  tabList: string[] = ['Editor', 'Products'];
  searchFields: any = {};
  pm: any;
  currentTab: PRODUCT_CATALOG_TABS = PRODUCT_CATALOG_TABS.EDITOR;
  advanceSearchModel: any = {
    title: 'Search by Editor Name',
    primary: 'editor',
    other: [{ key: 'editor', label: 'Editor' }],
  };
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private productCatalogue: ProductCatalogService
  ) {}

  ngOnInit(): void {
    this.displayedColumns = [
      'editor',
      'ProductManager',
      'noOfProducts',
      'Audit',
      'vendor',
      'Action',
    ];
    this.getEditors();
  }

  refreshTable() {
    // this.resetPaginationProperties();
    this.getEditors();
  }

  // resetPaginationProperties(): void {
  //   this.currentPageNum = 1;
  //   this.pageSize = 50;
  //   this.sortOrder = TableSortOrder.ASC;
  //   this.length = null;
  // }

  advanceSearchFilter(event: any) {
    this.searchFields = event;
    this.getEditors();
  }

  searchFilters() {
    this.getEditors();
  }

  sortData(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = sort.direction;
    this.getEditors();
  }

  get getFilters(): ProductCatalogManagementEditorListParams {
    return {
      pageNum: this.currentPageNum,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      ...(this.searchFields.editor?.trim() && {
        'search_params.name.filteringkey': this.searchFields.editor?.trim(),
      }),
    };
  }

  getEditors() {
    this._loading = true;
    this.dataSource = new MatTableDataSource([]);
    this.productCatalogue.getEditors(this.getFilters).subscribe(
      (res: any) => {
        this._loading = false;
        this.dataSource = new MatTableDataSource(res.editors);
        this.length = res.totalrecords;
      },
      (error) => {
        console.log(error);
        this._loading = false;
      }
    );
  }

  getPaginatorData(event: PaginationEvent) {
    this.currentPageNum = +event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getEditors();
  }

  createNewProducts() {
    this.router.navigate(['/optisam/pc/editors/create']);
  }

  editEditor(productId: any) {
    this.router.navigate(['/optisam/pc/editors/update/', productId]);
  }

  openDetails(element: any) {
    const dialogRef = this.dialog.open(EditorViewComponent, {
      width: '800px',
      disableClose: true,
      data: element,
    });
  }

  openProductComponent(element: any) {
    const dialogRef = this.dialog.open(EditorProductsDialogComponent, {
      width: '90%',
      disableClose: true,
      autoFocus: false,
      data: element,
    });
  }

  deleteEditorsConfirmation(product, template) {
    this.selectedProducts = product;
    this.openModal(template, '300px');
  }

  deleteEditor(success: any, error: any) {
    this.productCatalogue.deleteEditor(this.selectedProducts.id).subscribe(
      (resp) => {
        this._loading = false;
        this.openModal(success, '30%');
        this.getEditors();
      },
      (err) => {
        this._loading = false;
        this.openModal(error, '30%');
      }
    );
  }

  openModal(templateRef: any, width: any) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }
}

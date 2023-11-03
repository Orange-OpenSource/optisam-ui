import { Component, Inject, OnInit } from '@angular/core';
import { ProductCatalogService } from '@core/services';
import {
  AdvanceSearchField,
  AdvanceSearchFieldSelect,
  AdvanceSearchModel,
  ErrorResponse,
  LicenseType,
  PaginationDefaults,
  PaginationEvent,
  ProductCatalogEditorListParams,
  ProductCatalogProduct,
  ProductCatalogProductListParams,
  ProductCatalogProductsListResponse,
  ProductColumn,
  ProductLocation,
  TableSortOrder,
} from '@core/modals';
import { COLUMNS, PRODUCT_CATALOG_TABS } from '@core/util/constants/constants';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, Subscription, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewProductCatalogProductDialogComponent } from './view-product-catalog-product-dialog/view-product-catalog-product-dialog.component';
import { DeleteProductConfirmationProductCatalogComponent } from './delete-product-confirmation-product-catalog/delete-product-confirmation-product-catalog.component';
import { CreateProductComponent } from '../create-product/create-product.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  currentTab: PRODUCT_CATALOG_TABS = PRODUCT_CATALOG_TABS.PRODUCT;
  _loading: boolean = false;
  $productList: Observable<MatTableDataSource<ProductCatalogProduct>>;
  listData: MatTableDataSource<ProductCatalogProduct>;
  length: number;
  pageSizeOptions: number[] = [50, 100, 200];
  searchField: any = {};
  pageSize: number = this.pageSizeOptions[0];
  pageEvent: any;
  currentPage: number = 1;
  sortOrder: TableSortOrder = TableSortOrder.ASC;
  sortBy: string = 'name';
  editorName: any;
  selectedProducts: any;
  editorId: number = null;
  constructor(
    private productCatalogService: ProductCatalogService,
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  columns: ProductColumn[] = COLUMNS;

  advanceSearchModel: AdvanceSearchModel = {
    title: `PRODUCT_CATALOG.SEARCH_BY_NAME`,
    primary: this.primarySearchField.key,
    translate: true,
    other: [
      { key: 'name', label: 'Product Name' },
      ...(this.data?.id ? [] : [{ key: 'editor_name', label: 'Editor Name' }]),
      {
        key: 'locationType',
        label: 'DEPLOYMENT_TYPE',
        type: 'select',
        selection: [
          {
            key: 'PRODUCT_TABLE.HEADER.SAAS',
            value: 'SAAS',
          },
          {
            key: 'PRODUCT_TABLE.HEADER.ONPREMISE',
            value: 'On Premise',
          },
          { key: 'Both', value: 'Both' },
        ],
      },
      {
        key: 'licensing',
        label: 'LICENSING',
        type: 'select',
        selection: [
          {
            key: 'OPEN_SOURCE',
            value: 'OPENSOURCE',
          },
          {
            key: 'CLOSED_SOURCE',
            value: 'CLOSEDSOURCE',
          },
        ],
      },
    ],
  };

  ngOnInit(): void {
    this.editorName = this.data?.name;
    this.editorId = this.data?.id;
    this.getProductsList();
  }

  get primarySearchField(): ProductColumn {
    const primarySearchField = 'name';
    return this.columns.find(
      (col: ProductColumn) => col.key === primarySearchField
    );
  }

  get displayedColumns(): string[] {
    const additionalColumns = ['action'];
    return [
      ...this.columns.map((col: ProductColumn) => col.key),
      ...additionalColumns,
    ];
  }

  private getProductsList(): void {
    this._loading = true;
    this.listData = new MatTableDataSource([]);
    this.productCatalogService.getProductsList(this.getFilters).subscribe(
      ({ product, total_records }: ProductCatalogProductsListResponse) => {
        this._loading = false;
        this.listData = new MatTableDataSource(product);
        this.length = total_records;
      },
      (e: ErrorResponse) => {
        this._loading = false;
        console.log(e);
      }
    );
  }

  advanceSearchFilter(event) {
    this.searchField = event;
    this.searchFilters();
  }

  searchFilters() {
    this.getProductsList();
  }

  sortData(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = <TableSortOrder>sort.direction;
    this.getProductsList();
  }

  get getFilters(): ProductCatalogProductListParams {
    return {
      page_num: this.currentPage,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,

      ...(this.searchField.name?.trim() && {
        'search_params.name.filteringkey': encodeURIComponent(this.searchField.name?.trim()),
      }),
      ...(this.searchField.editor_name?.trim() && {
        'search_params.editorName.filteringkey':
          encodeURIComponent(this.searchField.editor_name?.trim()),
      }),
      ...(this.searchField.licensing?.trim() && {
        'search_params.licensing.filteringkey':
          this.searchField.licensing?.trim(),
      }),
      ...(this.searchField.locationType?.trim() && {
        'search_params.deploymentType.filteringkey':
          this.searchField.locationType?.trim(),
      }),
      ...(this.data && {
        'search_params.editorId.filteringkey': this.editorId,
      }),
    };
  }

  get productViewFilters() {
    return {
      page_num: this.currentPage,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
      'search_params.editorId.filteringkey': this.editorId,
    };
  }
  createProduct(): void {
    this.router.navigate(['/optisam/pc/products/create']);
  }

  viewProduct(element: ProductCatalogProduct): void {
    this.dialog.open(ViewProductCatalogProductDialogComponent, {
      width: '90%',
      minWidth: '800px',
      data: element,
      disableClose: true,
    });
  }

  editProducts(element: ProductCatalogProduct) {
    this.router.navigate(['/optisam/pc/products/update', element.id]);
  }

  editDialogProducts(element: ProductCatalogProduct) {
    this.dialog
      .open(CreateProductComponent, {
        height: '90%',
        width: '80%',
        minWidth: '800px',
        data: element,
        disableClose: true,
      })
      .afterClosed()
      .subscribe((updateStatus: boolean) => {
        console.log(updateStatus);
        if (updateStatus) {
          this.getProductsList();
        }
      });
  }
  getPaginatorData(e: PaginationEvent) {
    console.log(e);
    this.currentPage = +e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.getProductsList();
  }

  deleteProductDialog(element: any, dialog: any) {
    this.selectedProducts = element;
    this.openModal(dialog, '300px');
  }

  openModal(templateRef: any, width: any) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }

  deleteProducts(success: any, error: any) {
    this.productCatalogService
      .deleteProduct(this.selectedProducts.id)
      .subscribe(
        (res) => {
          console.log(res);
          this._loading = false;
          this.openModal(success, '30%');
          this.getProductsList();
        },
        (err) => {
          this._loading = false;
          this.openModal(error, '30%');
          this.getProductsList();
        }
      );
  }
  deleteProductsConfirmation(element: any, dialog: any, x?: any) {
    this.dialog
      .open(DeleteProductConfirmationProductCatalogComponent, {
        width: '300px',
        data: [element, x],
        disableClose: true,
      })
      .afterClosed()
      .subscribe((updateStatus: boolean) => {
        console.log(updateStatus);
        if (updateStatus) {
          this.searchFilters();
        }
      });
  }
}

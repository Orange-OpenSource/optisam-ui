import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  PaginationEvent,
  ProductCatalogEditor,
  ProductCatalogProduct,
  ProductCatalogProductsListResponse,
  ProductColumn,
} from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { COLUMNS } from '@core/util/constants/constants';
import { Subscription, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  @Input('editor') editorData: ProductCatalogEditor = null;
  sortBy: any = 'name';
  sortOrder: string = 'asc';
  _loading: boolean;
  listData: ProductCatalogProduct[];
  length: number;
  $productList: any;
  pageSizeOptions: number[] = [50, 100, 200];
  pageSize: number = this.pageSizeOptions[0];
  pageEvent: any;
  currentPage: number = 1;
  productList: any;
  columns: ProductColumn[] = COLUMNS;
  @Output() productSelected = new EventEmitter<string | number>();
  @Output() resetEditor: EventEmitter<boolean> = new EventEmitter<boolean>();
  searchField: any;
  currentId: string | number;
  firstLoad: boolean = true;
  existingFilterFields: any;
  $getProductsList: Subscription;

  constructor(private pc: ProductCatalogService) {}
  ngOnInit(): void {
    this.getProductList();
  }
  advanceSearchModel: any = {
    title: `PRODUCT_CATALOG.SEARCH_BY_NAME`,
    primary: this.primarySearchField.key,
    other: [
      { key: 'editor_name', label: 'Editor Name' },
      { key: 'name', label: 'Product Name' },
      { key: 'locationType', label: 'Location' },
      { key: 'licensing', label: 'Licensing' },
    ],
  };
  get primarySearchField(): ProductColumn {
    const primarySearchField = 'name';
    return this.columns.find(
      (col: ProductColumn) => col.key === primarySearchField
    );
  }
  get displayedColumns(): string[] {
    return [...this.columns.map((col: ProductColumn) => col.key)];
  }

  openProduct(productId: string | number) {
    this.currentId = productId;
    this.productSelected.emit(this.currentId);
  }

  getProductList() {
    this._loading = true;
    this.productList = new MatTableDataSource([]);
    this.$getProductsList = this.pc.getProductsList(this.getFilters).subscribe(
      ({ product, total_records }: ProductCatalogProductsListResponse) => {
        this._loading = false;
        this.listData = product;
        this.length = total_records;
        if (this.firstLoad) this.currentId = product[0]?.id;
        this.firstLoad = false;
        !!product && product.length && this.openProduct(this.currentId);
        this.productList = new MatTableDataSource(product);
      },
      (error: any) => {
        //TODO: remove the line below it's just for test
        console.log(error);
        this._loading = false;
      }
    );
  }

  sortData(sort: Sort) {
    this.sortOrder = sort.direction;
    this.sortBy = sort.active;
    this.getProductList();
  }

  advanceSearchFilter(event: any) {
    this.searchField = event;
    this.resetFilter();
    this.searchFilters();
  }

  searchFilters() {
    this.getProductList();
  }

  private resetFilter(): void {
    this.editorData = null;
    this.existingFilterFields = {};
    this.resetEditor.emit(true);
  }

  get getFilters() {
    if (this.editorData?.name) {
      this.existingFilterFields = {};
      this.existingFilterFields.editor_name = this.editorData.name;
    }
    return {
      page_num: this.currentPage,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,

      ...(this.searchField?.name?.trim() && {
        'search_params.name.filteringkey': this.searchField.name?.trim(),
      }),
      ...(this.searchField?.editor_name?.trim() && {
        'search_params.editorName.filteringkey':
          this.searchField?.editor_name?.trim(),
      }),
      ...(this.searchField?.licensing?.trim() && {
        'search_params.licensing.filteringkey':
          this.searchField?.licensing?.trim(),
      }),
      ...(this.searchField?.locationType?.trim() && {
        'search_params.locationType.filteringkey':
          this.searchField?.locationType?.trim(),
      }),
      ...(this.editorData?.id.trim() && {
        'search_params.editorId.filteringkey': this.editorData?.id,
      }),
      ...(this.editorData?.name.trim() && {
        'search_params.editor_name.filteringkey': this.editorData?.name,
      }),
    };
  }

  getPaginatorData(e: PaginationEvent) {
    this.currentPage = +e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.getProductList();
  }

  ngOnDestroy(): void {
    this.resetEditor.emit(true);
    this.$getProductsList?.unsubscribe();
  }
}

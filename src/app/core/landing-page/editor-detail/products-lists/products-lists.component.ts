import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ErrorResponse,
  ProductCatalogProduct,
  ProductCatalogProductListParams,
  ProductCatalogProductsListResponse,
  TableSortOrder,
} from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { PRODUCT_CATALOG_TABS } from '@core/util/constants/constants';

@Component({
  selector: 'app-products-lists',
  templateUrl: './products-lists.component.html',
  styleUrls: ['./products-lists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsListsComponent implements OnInit, OnChanges {
  @ViewChild('productsDiv', { static: false }) productsDiv: ElementRef;
  @Input() id: string;
  @Input() count: number;
  length: number = 0;
  searchField: string = '';
  pageSize: number = 50;
  pageEvent: any;
  productsListArray: string[];
  currentPage: number = 1;
  sortBy: string = 'name';
  sortOrder: TableSortOrder = TableSortOrder.ASC;
  listData: any;
  _productLoading: boolean = false;
  editorName: string = '';
  productSearchControl = new FormControl('');
  isLoading: boolean = false;

  constructor(
    private productCatalogService: ProductCatalogService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.id) {
      this.productSearchControl.setValue('');
      this.productsListArray = [];
      this.editorName = '';
      this.currentPage = 1;
      this.isLoading = false;
      this._productLoading = true;
      this.getProductsList();
    }
  }

  ngOnInit(): void {}

  @HostListener('window:scroll', ['$event'])
  onScrolledToLast(scrollableDiv: HTMLElement) {
    if (scrollableDiv !== undefined) return;
    if (
      this.productsListArray?.length > 49 &&
      this.productsListArray?.length < this.length
    ) {
      this.isLoading = true;
      this.currentPage++;
      this.getProductsList();
    }
  }

  getProductsList(): void {
    if (!this.id) return;
    this.productCatalogService.getProductsList(this.getFilters).subscribe(
      ({ product, total_records }: ProductCatalogProductsListResponse) => {
        this.listData = product;
        this.editorName = this.listData[0]?.editorName;
        this.productsListArray = [
          ...(this.productsListArray || []),
          ...this.listData,
        ];
        this._productLoading = false;
        this.isLoading = false;
        this.length = total_records;
        this.cd.detectChanges();
      },
      (e: ErrorResponse) => {
        this._productLoading = false;
        // this.loadingMore = false;
        console.log(e);
      }
    );
  }

  getSearchProductList(): void {
    if (!this.id) return;
    this.productCatalogService.getProductsList(this.searchFilters).subscribe(
      ({ product, total_records }: ProductCatalogProductsListResponse) => {
        this.listData = product;
        this.productsListArray = this.listData;
        this.editorName = this.listData[0]?.editorName;
        this._productLoading = false;
        this.length = total_records;
        this.cd.detectChanges();
      },
      (e: ErrorResponse) => {
        this._productLoading = false;
        console.log(e);
      }
    );
  }

  clearSearch() {
    this.productSearchControl.setValue('');
    this.updateSearchField();
  }

  get getFilters(): ProductCatalogProductListParams {
    return {
      page_num: this.currentPage,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,

      ...{
        'search_params.editorId.filteringkey': this.id,
      },
    };
  }

  get searchFilters(): ProductCatalogProductListParams {
    return {
      page_num: this.currentPage,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,

      ...{
        'search_params.editorId.filteringkey': this.id,
      },
      ...{
        'search_params.name.filteringkey': this.searchField,
      },
    };
  }

  updateSearchField() {
    this.currentPage = 1;
    this.searchField = this.productSearchControl.value;
    this.getSearchProductList();
  }

  productDetail(productDetails: ProductCatalogProduct): void {
    this.productCatalogService.addNewTab({
      tabName: PRODUCT_CATALOG_TABS.PRODUCT_DETAIL,
      from: PRODUCT_CATALOG_TABS.EDITOR_DETAIL,
      alias: productDetails.name,
      data: productDetails,
    });
  }

  onImgError(event): void {
    event.target.src = 'assets/images/default-company-icon.svg';
  }
}

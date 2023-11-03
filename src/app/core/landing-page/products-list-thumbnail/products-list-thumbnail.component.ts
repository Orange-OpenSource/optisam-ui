import { PRODUCT_CATALOG_TABS, ALL_SELECTION_NAME } from '@core/util/constants/constants';
import { SharedService } from 'src/app/shared/shared.service';
import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import {
  EditorFilters,
  ErrorResponse,
  LandingEditorParams,
  LandingProductParams,
  ProductCatalogEditor,
  ProductCatalogEditorListResponse,
  ProductCatalogProductListResponse,
  ProductCatalogProductSet,
  ProductFilters,
} from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, tap, filter } from 'rxjs/operators';
import { MatIcon } from '@angular/material/icon';

const ITEM_THUMBNAIL_NAME: string = 'app-product-item-thumb';
const THUMBNAIL_MIN_WIDTH: number = 300; // In pixel

@Component({
  selector: 'app-products-list-thumbnail',
  templateUrl: './products-list-thumbnail.component.html',
  styleUrls: ['./products-list-thumbnail.component.scss'],
})
export class ProductsListThumbnailComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('itemContainer') container: ElementRef<HTMLElement>;
  @ViewChild('closeDetail') closeBtn: ElementRef<HTMLDivElement>;
  @ViewChild('productDetailsContainer') productDetailsContainer: ElementRef<HTMLDivElement>;
  @ViewChild('productName') productName: ElementRef<HTMLDivElement>;
  @ViewChild('closeButton') productDetailsCloseButton: ElementRef<HTMLDivElement>;
  defaultItemGap: string = '10px';
  gap: string = this.defaultItemGap;
  editorItemWidth: number = 300;
  productList: ProductCatalogProductSet[] = [];
  editorListCall$: Observable<ErrorResponse | ProductCatalogEditorListResponse>;
  editorsList$: Observable<ProductCatalogEditor[]>;
  currentPage: number = 1;
  pageSize: number = 50;
  sortBy: string = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  totalProducts: number = 0;
  filterForm: FormGroup;
  valueChanges: Subscription;
  filterDelay: number = 300;
  currentFilter: any = null;
  productFilters: ProductFilters;
  isNextLoad: boolean = false;
  loadingSet: boolean[] = [];
  notLoadingSet: boolean[] = [];
  loadingProducts: boolean = false;
  productDetailToggle: boolean = false;
  @Output() productDetail: EventEmitter<ProductCatalogProductSet> =
    new EventEmitter<ProductCatalogProductSet>();
  productInfo: ProductCatalogProductSet;
  firstContainerWidth: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.fixThumbnailSize();
    this.setRightMarginOfProductDetailsHeader()
  }
  constructor(
    private cd: ChangeDetectorRef,
    private pc: ProductCatalogService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getProductList();
    this.allStreams();
    this.preLoad();
  }

  ngAfterViewChecked(): void {
    this.fixThumbnailSize();
    this.setRightMarginOfProductDetailsHeader();
  }

  get searchControl(): FormControl {
    return this.filterForm.get('search') as FormControl;
  }

  get lastPage(): number {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  get params(): LandingProductParams {
    return <LandingProductParams>{
      page_num: this.currentPage,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
      ...(this.searchControl.value?.trim() && {
        'search_params.name.filteringkey': encodeURIComponent(this.searchControl.value.trim()),
      }),
      ...(!!this.productFilters?.filters?.deploymentType?.length && {
        'search_params.deploymentType.filteringkey':
          this.productFilters?.filters?.deploymentType.join(','),
      }),
      ...(!!this.productFilters?.filters?.vendor?.length && {
        'search_params.vendor.filteringkey':
          this.productFilters?.filters?.vendor.join(','),
      }),
      ...(!!this.productFilters?.filters?.recommendation?.length && {
        'search_params.recommendation.filteringkey':
          this.productFilters?.filters?.recommendation.join(','),
      }),
      ...(!!this.productFilters?.filters?.licensing?.length && {
        'search_params.licensing.filteringkey':
          this.productFilters?.filters?.licensing.join(','),
      }),
      ...(!!this.productFilters?.filters?.entities?.length && {
        'search_params.entities.filteringkey':
          this.productFilters?.filters?.entities.join(','),
      }),
    };
  }

  private setRightMarginOfProductDetailsHeader(): void {
    if (!this.productDetailsContainer) return;
    const scrollWidth: number = this.productDetailsContainer.nativeElement.offsetWidth - this.productDetailsContainer.nativeElement.clientWidth;
    this.productName.nativeElement.style.setProperty('margin-right', scrollWidth + 10 + 'px');
    if (this.productDetailsCloseButton.nativeElement) { }
    this.productDetailsCloseButton.nativeElement.style.right = scrollWidth - 17 + 'px';

  }

  private formInit(): void {
    this.filterForm = this.fb.group({
      search: this.fb.control(''),
      filters: this.fb.group({
        deploymentType: this.fb.control([]),
        vendor: this.fb.control([]),
        recommendation: this.fb.control([]),
        licensing: this.fb.control([]),
        entities: this.fb.control([]),
      }),
    });
  }

  private getProductList(): void {
    this.loadingSet.push(true);
    this.loadingProducts = this.loadingSet.length !== this.notLoadingSet.length;
    this.cd.detectChanges();
    this.pc.getProductLanding(this.params).subscribe(
      (res: ProductCatalogProductListResponse) => {
        this.notLoadingSet.push(false);
        this.loadingProducts =
          this.loadingSet.length !== this.notLoadingSet.length;
        this.totalProducts = res.total_records;
        if (!this.isNextLoad) this.productList = [];
        this.productList = [...this.productList, ...res.product];
        this.isNextLoad = false;
        this.cd.detectChanges();
      },
      (error: ErrorResponse) => {
        this.notLoadingSet.push(false);
        this.loadingProducts =
          this.loadingSet.length !== this.notLoadingSet.length;
        this.isNextLoad = false;
        this.cd.detectChanges();
      }
    );
  }

  private fixThumbnailSize(): void {
    const container: HTMLElement = this.container?.nativeElement as HTMLElement;
    if (this.hasWhiteSpace()) {
      // set thumbnails for min-width;
      container
        ?.querySelectorAll(ITEM_THUMBNAIL_NAME)
        ?.forEach((thumbnail: HTMLElement, index: number) => {
          thumbnail?.style?.setProperty(
            'max-width',
            THUMBNAIL_MIN_WIDTH + 'px'
          );
        });
      this.firstContainerWidth = THUMBNAIL_MIN_WIDTH;
      return;
    }

    const firstContainerWidth: number = (
      container?.querySelector(ITEM_THUMBNAIL_NAME) as HTMLElement
    )?.getBoundingClientRect()?.width;


    container
      ?.querySelectorAll(ITEM_THUMBNAIL_NAME)
      ?.forEach((thumbnail: HTMLElement, index: number) => {
        if (thumbnail?.getBoundingClientRect()?.width !== firstContainerWidth)
          thumbnail?.style?.setProperty('max-width', firstContainerWidth + 'px');
        if (!thumbnail?.style.marginRight)
          thumbnail?.style.setProperty('margin-right', this.defaultItemGap);

      });

    this.firstContainerWidth = firstContainerWidth;
    return;
  }

  private hasWhiteSpace(): boolean {
    const container: HTMLElement = this.container?.nativeElement as HTMLElement;
    const totalThumbnailWidth: number = Array.from(
      container.querySelectorAll(ITEM_THUMBNAIL_NAME)
    )?.reduce((allWidth: number, el: HTMLElement) => {
      allWidth +=
        el.getBoundingClientRect().width +
        parseFloat(el.style.marginRight || '0') +
        parseFloat(el.style.marginLeft || '0');
      return allWidth;
    }, 0);
    return totalThumbnailWidth < container.scrollWidth;
  }

  private nextLoad(): void {
    if (this.currentPage >= this.lastPage) return;
    this.isNextLoad = true;
    this.currentPage += 1;
    this.getProductList();
  }

  private resetPage(): void {
    this.currentPage = 1;
    this.totalProducts = 0;
    this.productList = [];
    this.cd.detectChanges();
  }

  scrolledToLast(): void {
    if (!this.loadingProducts) this.nextLoad();
  }

  private allStreams(): void {
    this.valueChanges = this.filterForm.valueChanges.pipe(debounceTime(200)).subscribe(
      (filters: ProductFilters) => {
        const searchChanged: boolean =
          filters.search !== (this.productFilters?.search || '');
        for (const filter in filters.filters)
          filters.filters[filter] = filters.filters[filter].filter(
            (f) => f != ALL_SELECTION_NAME
          );

        this.productFilters = filters;
        if (!searchChanged) {
          this.resetPage();
          this.getProductList();
        }
      }
    );
  }

  productDetails(product: ProductCatalogProductSet): void {
    this.productDetailToggle = true;
    this.productInfo = product;
    this.closeBtn?.nativeElement?.scrollIntoView();
    // document.querySelector('app-product-item-thumb.active')?.scrollIntoView();
  }

  private productDetailsPage(product: ProductCatalogProductSet): void {
    this.pc.addNewTab({
      tabName: PRODUCT_CATALOG_TABS.PRODUCT_DETAIL,
      from: PRODUCT_CATALOG_TABS.PRODUCT,
      alias: product.name
    });
    this.productDetail.next(product);
  }

  private preLoad(): void { }

  getPaginatorData(e: any): void {
    this.currentPage = +e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.getProductList();
  }

  triggerSearch(value: string): void {
    this.getProductList();
  }

  onImgError(event: any): void {
    event.target.src = 'assets/images/default-company-icon.svg'
  }

  removeActive(): void {

  }

  ngOnDestroy(): void {
    this.valueChanges.unsubscribe();
  }
}

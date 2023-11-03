import { PRODUCT_CATALOG_TABS } from '@core/util/constants/constants';
import { ALL_SELECTION_NAME } from './../../util/constants/constants';
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
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import {
  EditorFilters,
  ErrorResponse,
  LandingEditorParams,
  ProductCatalogEditor,
  ProductCatalogEditorListResponse,
} from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

const ITEM_THUMBNAIL_NAME: string = 'app-editor-item-thumb';
const THUMBNAIL_MIN_WIDTH: number = 300; // In pixel

@Component({
  selector: 'app-editors-list-thumbnail',
  templateUrl: './editors-list-thumbnail.component.html',
  styleUrls: ['./editors-list-thumbnail.component.scss'],
})
export class EditorsListThumbnailComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('itemContainer') container: ElementRef<HTMLElement>;
  defaultItemGap: string = '10px';
  gap: string = this.defaultItemGap;
  editorItemWidth: number = 300;
  editorList: ProductCatalogEditor[] = [];
  editorListCall$: Observable<ErrorResponse | ProductCatalogEditorListResponse>;
  editorsList$: Observable<ProductCatalogEditor[]>;
  currentPage: number = 1;
  pageSize: number = 50;
  sortBy: string = 'productsCount';
  sortOrder: 'asc' | 'desc' = 'desc';
  totalEditors: number = 0;
  filterForm: FormGroup;
  valueChanges: Subscription;
  filterDelay: number = 300;
  currentFilter: any = null;
  editorFilters: EditorFilters;
  isNextLoad: boolean = false;
  loadingSet: boolean[] = [];
  notLoadingSet: boolean[] = [];
  loadingEditors: boolean = false;
  @Output() editorInfo: EventEmitter<ProductCatalogEditor> =
    new EventEmitter<ProductCatalogEditor>();
  firstContainerWidth: number = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.fixThumbnailSize();
  }
  constructor(
    private cd: ChangeDetectorRef,
    private pc: ProductCatalogService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.getEditorList();
    this.allStreams();
    // setInterval(() => {
    //   this.pc.setProductListingData(new Date().getTime());
    // }, 1000);
  }

  ngAfterViewChecked(): void {
    this.fixThumbnailSize();
  }

  get searchControl(): FormControl {
    return this.filterForm.get('search') as FormControl;
  }

  get lastPage(): number {
    return Math.ceil(this.totalEditors / this.pageSize);
  }

  get params(): LandingEditorParams {
    return <LandingEditorParams>{
      pageNum: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      ...(this.searchControl.value?.trim() && {
        'search_params.name.filteringkey': encodeURIComponent(this.searchControl.value?.trim()),
      }),
      ...(!!this.editorFilters?.filters?.audit?.length && {
        'search_params.audityears.filteringkey':
          this.editorFilters?.filters?.audit.join(','),
      }),
      ...(!!this.editorFilters?.filters?.country?.length && {
        'search_params.countryCodes.filteringkey':
          this.editorFilters?.filters?.country.join(','),
      }),
      ...(!!this.editorFilters?.filters?.entities?.length && {
        'search_params.entities.filteringkey':
          this.editorFilters?.filters?.entities.join(','),
      }),
      ...(!!this.editorFilters?.filters?.groupContract?.length && {
        'search_params.group_contract.filteringkey':
          this.editorFilters?.filters?.groupContract.join(','),
      }),
    };
  }

  private formInit(): void {
    this.filterForm = this.fb.group({
      search: this.fb.control(''),
      filters: this.fb.group({
        groupContract: this.fb.control([]),
        entities: this.fb.control([]),
        audit: this.fb.control([]),
        country: this.fb.control([]),
      }),
    });
  }

  private getEditorList(): void {
    this.loadingSet.push(true);
    this.loadingEditors = this.loadingSet.length !== this.notLoadingSet.length;
    this.cd.detectChanges();
    this.pc.getEditorsLanding(this.params).subscribe(
      (res: ProductCatalogEditorListResponse) => {
        this.notLoadingSet.push(false);
        this.loadingEditors =
          this.loadingSet.length !== this.notLoadingSet.length;
        this.totalEditors = res.totalrecords;
        if (!this.isNextLoad) this.editorList = [];
        this.editorList = [...this.editorList, ...res.editors];
        this.isNextLoad = false;
        this.fixThumbnailSize();
        this.cd.detectChanges();
      },
      (error: ErrorResponse) => {
        this.notLoadingSet.push(false);
        this.loadingEditors =
          this.loadingSet.length !== this.notLoadingSet.length;
        this.isNextLoad = false;
        console.log(error);
        this.cd.detectChanges();
      }
    );
  }

  fixThumbnailSize(): void {
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
          thumbnail?.style?.setProperty(
            'max-width',
            firstContainerWidth + 'px'
          );
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
    this.getEditorList();
  }

  private resetPage(): void {
    this.currentPage = 1;
    this.totalEditors = 0;
    this.editorList = [];
    this.cd.detectChanges();
  }

  scrolledToLast(): void {
    if (!this.loadingEditors) this.nextLoad();
  }

  private allStreams(): void {
    this.valueChanges = this.filterForm.valueChanges.pipe(debounceTime(400)).subscribe(
      (filters: EditorFilters) => {
        const searchChanged: boolean =
          filters.search !== (this.editorFilters?.search || '');
        for (const filter in filters.filters)
          filters.filters[filter] = filters.filters[filter].filter(
            (f) => f != ALL_SELECTION_NAME
          );

        this.editorFilters = filters;
        if (!searchChanged) {
          this.resetPage();
          this.getEditorList();
        }
      }
    );
  }

  editorDetails(editor: ProductCatalogEditor): void {
    this.pc.addNewTab({
      tabName: PRODUCT_CATALOG_TABS.EDITOR_DETAIL,
      from: PRODUCT_CATALOG_TABS.EDITOR,
      alias: editor.name
    });
    this.editorInfo.next(editor);
  }

  getPaginatorData(e: any): void {
    this.currentPage = +e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.getEditorList();
  }

  searchText(searchText: string): void {
    this.getEditorList();
  }

  ngOnDestroy(): void {
    this.valueChanges.unsubscribe();
  }
}

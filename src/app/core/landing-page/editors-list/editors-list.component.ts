import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  ErrorResponse,
  LandingEditorParams,
  PaginationEvent,
  ProductCatalogEditor,
  ProductCatalogEditorListResponse,
} from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editors-list',
  templateUrl: './editors-list.component.html',
  styleUrls: ['./editors-list.component.scss'],
})
export class EditorsListComponent implements OnInit, OnDestroy {
  advanceSearchModel: any = {
    title: 'Search by Editor Name',
    primary: 'editor',
    other: [{ key: 'editor', label: 'editor' }],
  };
  _loading: boolean = true;
  currentPageNum: any = 1;
  sortOrder: any = 'desc';
  length: any;
  displayedColumns: string[];
  currentPage: number = 1;
  pageSizeOptions: number[] = [50, 100, 200];
  pageSize: number = this.pageSizeOptions[0];
  sortBy: string = 'productsCount';
  dataSource: MatTableDataSource<ProductCatalogEditor>;
  @Output() editorSelected = new EventEmitter<string | number>();
  @Output() showEditorProducts: EventEmitter<ProductCatalogEditor> =
    new EventEmitter<ProductCatalogEditor>();
  pageEvent: any;
  searchFields: any;
  currentId: string | number;
  firstLoad: boolean = true;
  $getEditorsLanding: Subscription;

  constructor(private productCatalogue: ProductCatalogService) {}

  ngOnInit(): void {
    this.displayedColumns = ['editor', 'NoofProducts'];
    this.getEditors();
  }
  openDetails(editorId: string | number) {
    this.currentId = editorId;
    this.editorSelected.emit(this.currentId);
  }
  getEditors() {
    this._loading = true;
    this.dataSource = new MatTableDataSource([]);

    this.$getEditorsLanding = this.productCatalogue
      .getEditorsLanding(this.getFilters)
      .subscribe(
        (res: ProductCatalogEditorListResponse) => {
          this._loading = false;
          this.dataSource = new MatTableDataSource(res.editors);
          if (this.firstLoad)
            this.currentId = this.dataSource.filteredData[0]?.id;
          this.firstLoad = false;
          !!this.dataSource.filteredData.length &&
            this.openDetails(this.currentId);
          this.length = res.totalrecords;
        },
        (error: ErrorResponse) => {
          console.log(error);
          this._loading = false;
        }
      );
  }

  advanceSearchFilter(event: any) {
    console.log(event);
    this.searchFields = event;
    this.searchFilters();
  }

  getPaginatorData(e: PaginationEvent) {
    this.currentPage = +e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.getEditors();
  }

  searchFilters() {
    this.getEditors();
  }

  get getFilters() {
    return {
      pageNum: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,

      ...(this.searchFields?.editor?.trim() && {
        'search_params.name.filteringkey': encodeURIComponent(this.searchFields.editor?.trim()),
      }),
    };
  }

  sortData(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = sort.direction;
    this.getEditors();
  }

  goToEditorProducts(editor: ProductCatalogEditor): void {
    this.showEditorProducts.emit(editor);
  }

  ngOnDestroy(): void {
    this.$getEditorsLanding?.unsubscribe();
  }
}

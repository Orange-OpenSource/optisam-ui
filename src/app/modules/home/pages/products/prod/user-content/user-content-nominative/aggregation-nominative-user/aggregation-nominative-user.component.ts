import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  NominativeUserList,
  ErrorResponse,
  AdvanceSearchField,
  AdvanceSearchModel,
  NominativeUserListParams,
  NominativeUserListResponse,
  PaginationEvent,
  TabMenu,
  UserCountDetailData,
  ProductType,
  Products,
  UserIndividualCountDetailData,
  UserAggregationCountDetailData,
  ProductAggregation,
  NominativeUsersExportParams,
  DownloadInput,
} from '@core/modals';
import { ProductService, CommonService, ReportService } from '@core/services';
import {
  LOCAL_KEYS,
  REPORT_TRANSLATIONS,
} from '@core/util/constants/constants';
import { AddNominativeUserDialogComponent } from '@home/pages/data-management/nominative-users/add-nominative-user-dialog/add-nominative-user-dialog.component';
import { SharedService } from '@shared/shared.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-aggregation-nominative-user',
  templateUrl: './aggregation-nominative-user.component.html',
  styleUrls: ['./aggregation-nominative-user.component.scss'],
})
export class AggregationNominativeUserComponent implements OnInit {
  _loading: boolean = false;
  length: number = 1;
  tabMenus: TabMenu;
  pageSizeOption: number[] = [50, 100, 200];
  pageSize: number = this.pageSizeOption[0];
  dialogSetting: MatDialogConfig = {
    disableClose: true,
    minWidth: '600px',
    width: '80vw',
    height: '80vh',
  };

  nominativeUserData$: Observable<
    MatTableDataSource<NominativeUserList> | ErrorResponse
  >;

  columns: AdvanceSearchField[] = [
    {
      key: 'aggregation_name',
      label: 'NOMINATIVE_USER.TABLE_HEADER.AGGREGATION',
      show: false,
    },
    { key: 'user_name', label: 'NOMINATIVE_USER.TABLE_HEADER.USERNAME' },
    {
      key: 'first_name',
      label: 'NOMINATIVE_USER.TABLE_HEADER.USER_FIRST_NAME',
    },
    { key: 'user_email', label: 'NOMINATIVE_USER.TABLE_HEADER.EMAIL' },
    { key: 'profile', label: 'NOMINATIVE_USER.TABLE_HEADER.PROFILE' },
    {
      key: 'activation_date',
      label: 'NOMINATIVE_USER.TABLE_HEADER.ACTIVATION_DATE',
      type: 'date',
    },
  ];

  advanceSearchModel: AdvanceSearchModel = {
    title: 'NOMINATIVE_USER.TITLE.USER_SEARCH_TITLE',
    primary: 'user_name',
    other: this.columns,
    translate: true,
  };
  currentPageNumber: number = 1;
  nominativeUsersList: MatTableDataSource<NominativeUserList> =
    new MatTableDataSource([]);
  subs: SubSink = new SubSink();
  productType: ProductType = null;
  product: ProductAggregation;
  sortBy: string = 'activation_date';
  sortOder: SortDirection = 'asc';
  listLoading: boolean = false;
  searchFields: any;
  exporting: boolean = false;

  get displayedColumns(): string[] {
    return this.columns.map((col: AdvanceSearchField) => col.key);
  }

  constructor(
    private productService: ProductService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private cs: CommonService,
    private rs: ReportService
  ) { }

  ngOnInit(): void {
    this.getStreamingData();
  }

  get isProduct(): boolean {
    return this.productType === ProductType.INDIVIDUAL;
  }

  get filters(): NominativeUserListParams {
    return <NominativeUserListParams>{
      page_num: this.currentPageNumber,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOder,
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      is_product: this.isProduct,
      'search_params.aggregation_name.filteringkey':
        this.product?.aggregation_name,
      'search_params.aggregation_name.filter_type': true,
      ...(this.searchFields?.activation_date?.trim() && {
        'search_params.activation_date':
          this.searchFields.activation_date?.trim(),
      }),
      ...(this.searchFields?.first_name?.trim() && {
        'search_params.first_name.filteringkey':
          this.searchFields.first_name?.trim(),
      }),
      ...(this.searchFields?.profile?.trim() && {
        'search_params.profile.filteringkey': this.searchFields.profile?.trim(),
      }),
      ...(this.searchFields?.user_email?.trim() && {
        'search_params.user_email.filteringkey':
          this.searchFields.user_email?.trim(),
      }),
      ...(this.searchFields?.user_name?.trim() && {
        'search_params.user_name.filteringkey':
          this.searchFields.user_name?.trim(),
      }),
    };
  }

  private getNominativeUserList(): void {
    this.listLoading = true;
    this.nominativeUsersList = new MatTableDataSource([]);
    this.productService.getNominativeUserList(this.filters).subscribe(
      (res: NominativeUserListResponse) => {
        this.listLoading = false;
        this.nominativeUsersList = new MatTableDataSource(res.nominative_user);
        this.length = res.totalRecords;
        this.cd.detectChanges();
      },
      (e: ErrorResponse) => {
        this.listLoading = false;
        this.cd.detectChanges();
        this.sharedService.commonPopup({
          title: 'Error',
          buttonText: 'OK',
          message: e.message,
          singleButton: true,
        });
      }
    );
  }

  getPaginatorData(paginationData: PaginationEvent): void {
    this.pageSize = paginationData.pageSize;
    this.currentPageNumber = paginationData.pageIndex + 1;
    //TODO: call list request
    this.getNominativeUserList();
  }

  advSearchTrigger(searchData: any): void {
    this.searchFields = searchData;
    this.currentPageNumber = 1;
    this.getNominativeUserList();
  }

  sortData(sort: Sort): void {
    this.sortBy = sort.active;
    this.sortOder = sort.direction;
    this.getNominativeUserList();
  }
  addNominativeUser(): void {
    this.dialog.open(AddNominativeUserDialogComponent, this.dialogSetting);
  }

  editUser(nominativeUser: NominativeUserList): void {
    this.dialog.open(AddNominativeUserDialogComponent, {
      ...this.dialogSetting,
      data: nominativeUser,
    });
  }

  getStreamingData(): void {
    this.subs.add(
      this.sharedService.httpLoading().subscribe((isLoading: boolean) => {
        this._loading = isLoading;
        this.cd.detectChanges();
      })
    );
    this.subs.add(
      this.productService
        .getUserCountDetailData()
        .subscribe((userCountDetailData: UserAggregationCountDetailData) => {
          this.productType = userCountDetailData?.productType;
          this.product = userCountDetailData?.product;
          this.getNominativeUserList();
        })
    );
  }

  exportUsers(): void {
    if (this.exporting) return;
    this.exporting = true;
    const params: NominativeUsersExportParams = {
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      sort_by: 'user_email',
      sort_order: 'asc',
      is_product: false,
      'search_params.aggregation_name.filteringkey':
        this.product?.aggregation_name,
      'search_params.aggregation_name.filter_type': true,
    };
    this.productService.getNominativeUserExport(params).subscribe(
      (res: NominativeUserListResponse) => {
        this.exporting = false;
        this.cd.detectChanges();

        const excludes = [
          'product_name',
          'activation_date_string',
          'aggregation_id',
          'comment',
          'id',
          'editor',
          'product_version',
        ];
        let headerList: string[] = Object.keys(res.nominative_user[0]);
        headerList = headerList.filter((h) => !excludes.includes(h));

        const paramsDownload: DownloadInput = {
          data: res.nominative_user,
          headerList,
          filename: this.product?.aggregation_name || 'unknown',
          formatType: 'CSV',
          translations: REPORT_TRANSLATIONS,
        };
        this.rs.downloadFile(paramsDownload);
      },
      (e: ErrorResponse) => {
        this.exporting = false;
        this.cd.detectChanges();
        this.sharedService.commonPopup({
          title: 'Error',
          buttonText: 'OK',
          message: e.message,
          singleButton: true,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

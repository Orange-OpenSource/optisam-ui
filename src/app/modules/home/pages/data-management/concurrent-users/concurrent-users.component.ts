import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  AdvanceSearchField,
  AdvanceSearchModel,
  ErrorResponse,
  ConcurrentUserList,
  ConcurrentUserListParams,
  ConcurrentUserListResponse,
  PaginationEvent,
  TabMenu,
  ConcurrentUsersExportParams,
  ProductType,
} from '@core/modals';
import { CommonService, ReportService } from '@core/services';
import { ProductService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';
import { Observable } from 'rxjs';
import { AddConcurrentUsersDialogComponent } from './add-concurrent-users-dialog/add-concurrent-users-dialog.component';
import { IndividualConcurrentUserComponent } from './individual-concurrent-user/individual-concurrent-user.component';
import { AggregationConcurrentUserComponent } from './aggregation-concurrent-user/aggregation-concurrent-user.component';

@Component({
  selector: 'app-concurrent-users',
  templateUrl: './concurrent-users.component.html',
  styleUrls: ['./concurrent-users.component.scss'],
})
export class ConcurrentUsersComponent implements OnInit {
  @ViewChild(IndividualConcurrentUserComponent)
  individualConcurrentUserComponent: IndividualConcurrentUserComponent;
  @ViewChild(AggregationConcurrentUserComponent)
  aggregationConcurrentUserComponent: AggregationConcurrentUserComponent;

  _loading: boolean = false;
  length: number = 1;
  pageSizeOption: number[] = [50, 100, 200];
  pageSize: number = this.pageSizeOption[0];
  dialogSetting: MatDialogConfig = {
    disableClose: false,
    minWidth: '600px',
    width: '80vw',
  };

  ConcurrentUserData$: Observable<
    MatTableDataSource<ConcurrentUserList> | ErrorResponse
  >;

  columns: AdvanceSearchField[] = [
    { key: 'product_name', label: 'CONCURRENT_USER.TABLE_HEADER.PRODUCT' },
    { key: 'editor', label: 'CONCURRENT_USER.TABLE_HEADER.EDITOR' },
    { key: 'product_version', label: 'CONCURRENT_USER.TABLE_HEADER.VERSION' },
    { key: 'profile', label: 'CONCURRENT_USER.TABLE_HEADER.PROFILE' },
    {
      key: 'action',
      label: 'CONCURRENT_USER.TABLE_HEADER.ACTIONS',
      show: false,
    },
  ];

  advanceSearchModel: AdvanceSearchModel = {
    title: 'CONCURRENT_USER.TITLE.SEARCH_TITLE',
    primary: '',
    other: this.columns,
  };
  currentPageNumber: number = 1;
  concurrentUsersList: MatTableDataSource<ConcurrentUserList> =
    new MatTableDataSource([]);

  tabMenus: TabMenu[] = [
    {
      title: 'CONCURRENT_USER.TAB.INDIVIDUAL',
      link: '#',
      show: true,
    },

    {
      title: 'CONCURRENT_USER.TAB.AGGREGATION',
      link: '#',
      show: true,
    },
  ];
  activeTitle: string = this.tabMenus[0].title;
  inProcess: any = false;

  get displayedColumns(): string[] {
    return this.columns.map((col: AdvanceSearchField) => col.key);
  }

  constructor(
    private productService: ProductService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private cs: CommonService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.sharedService.httpLoading().subscribe((isLoading: boolean) => {
      this._loading = isLoading;
      this.cd.detectChanges();
    });
  }

  get individualType(): string {
    return 'CONCURRENT_USER.TAB.INDIVIDUAL';
  }

  get aggregationType(): string {
    return 'CONCURRENT_USER.TAB.AGGREGATION';
  }

  get isDataAvailable(): boolean {
    return !!(
      this.activeTitle === this.individualType
        ? this.individualConcurrentUserComponent
        : this.aggregationConcurrentUserComponent
    )?.concurrentUsersList?.filteredData?.length;
  }

  addConcurrentUser(): void {
    this.dialog
      .open(AddConcurrentUsersDialogComponent, {
        ...this.dialogSetting,
        data: {
          activeTitle: this.activeTitle,
          editData: null,
        },
      })
      .afterClosed()
      .subscribe((status: boolean) => {
        if (status) {
          if (this.activeTitle === 'CONCURRENT_USER.TAB.INDIVIDUAL') {
            this.individualConcurrentUserComponent.getConcurrentUserList();
            return;
          }
          this.aggregationConcurrentUserComponent.getConcurrentUserList();
        }
      });
  }

  editUser(ConcurrentUser: ConcurrentUserList): void {
    this.dialog.open(AddConcurrentUsersDialogComponent, {
      ...this.dialogSetting,
      data: ConcurrentUser,
    });
  }

  exportConcurrentUser(): void {
    if (this.inProcess || !this.isDataAvailable) return;
    this.inProcess = true;
    const params: ConcurrentUsersExportParams = {
      sort_by: 'aggregation_name',
      sort_order: 'asc',
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      is_aggregation: this.activeTitle === 'CONCURRENT_USER.TAB.AGGREGATION',
    };

    this.productService.getConcurrentUserExport(params).subscribe(
      (res: ConcurrentUserListResponse) => {
        const reportContents: ConcurrentUserList[] = res.concurrent_user;
        const headerList: string[] = [];
        const excludedHeaders: string[] = [
          'id',
          'aggregation_id',
          'is_aggregation',
          'purchase_date',
          ...(this.activeTitle === 'CONCURRENT_USER.TAB.INDIVIDUAL'
            ? ['aggregation_name']
            : ['product_name']),
        ];
        for (var k in reportContents[0])
          if (!excludedHeaders.includes(k)) headerList.push(k);

        const fields: AdvanceSearchField[] =
          this.activeTitle === this.individualType
            ? this.individualConcurrentUserComponent.columns
            : this.aggregationConcurrentUserComponent.columns;

        const translations: object = fields.reduce(
          (translations: object, field: AdvanceSearchField) => {
            if (field?.show !== false) translations[field.key] = field.label;
            return translations;
          },
          {}
        );

        this.reportService.downloadFile({
          data: reportContents,
          headerList: Object.keys(translations),
          filename: `Report_concurrent_users_${
            this.activeTitle === 'CONCURRENT_USER.TAB.INDIVIDUAL'
              ? 'individual'
              : 'aggregation'
          }`,
          formatType: 'CSV',
          translations,
        });
        this.inProcess = false;
      },
      (error: ErrorResponse) => {
        this.inProcess = false;

        this.sharedService.commonPopup({
          title: 'Error',
          message: error.message,
          buttonText: 'OK',
          singleButton: true,
        });
        console.log(error);
      }
    );
  }
}

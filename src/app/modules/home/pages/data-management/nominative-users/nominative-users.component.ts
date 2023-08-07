import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  AdvanceSearchField,
  AdvanceSearchModel,
  DownloadInput,
  ErrorResponse,
  NominativeUserList,
  NominativeUserListParams,
  NominativeUserListResponse,
  NominativeUsersExportParams,
  PaginationEvent,
  ProductType,
  TabMenu,
} from '@core/modals';
import { CommonService, ReportService } from '@core/services';
import { ProductService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';
import { Observable } from 'rxjs';
import { AddNominativeUserDialogComponent } from './add-nominative-user-dialog/add-nominative-user-dialog.component';
import { AdminIndividualNominativeUserComponent } from './admin-individual-nominative-user/admin-individual-nominative-user.component';
import { AggregationNominativeUserComponent } from './aggregation-nominative-user/aggregation-nominative-user.component';
import { SubSink } from 'subsink';
import { DataManagementService } from '@core/services/data-management.service';

@Component({
  selector: 'app-nominative-users',
  templateUrl: './nominative-users.component.html',
  styleUrls: ['./nominative-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NominativeUsersComponent
  implements OnInit, AfterViewInit, OnDestroy {
  subs: SubSink = new SubSink();
  @ViewChild(AdminIndividualNominativeUserComponent)
  individualNominativeUser: AdminIndividualNominativeUserComponent;

  @ViewChild(AggregationNominativeUserComponent)
  aggregationNominativeUser: AggregationNominativeUserComponent;

  _loading: boolean = false;
  length: number = 1;
  pageSizeOption: number[] = [50, 100, 200];
  pageSize: number = this.pageSizeOption[0];
  dialogSetting: MatDialogConfig = {
    disableClose: true,
    minWidth: '600px',
    width: '80vw',
  };
  inProcess: boolean = false;

  nominativeUserData$: Observable<
    MatTableDataSource<NominativeUserList> | ErrorResponse
  >;

  columns: AdvanceSearchField[] = [
    { key: 'product_name', label: 'NOMINATIVE_USER.TABLE_HEADER.PRODUCT' },
    { key: 'editor', label: 'NOMINATIVE_USER.TABLE_HEADER.EDITOR' },
    { key: 'product_version', label: 'NOMINATIVE_USER.TABLE_HEADER.VERSION' },
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
    },
    {
      key: 'action',
      label: 'NOMINATIVE_USER.TABLE_HEADER.ACTIONS',
      show: false,
    },
  ];

  advanceSearchModel: AdvanceSearchModel = {
    title: 'NOMINATIVE_USER.TITLE.SEARCH_TITLE',
    primary: '',
    other: this.columns,
    translate: true,
  };
  currentPageNumber: number = 1;
  nominativeUsersList: MatTableDataSource<NominativeUserList> =
    new MatTableDataSource([]);

  tabMenus: TabMenu[] = [
    {
      title: 'CONCURRENT_USER.TAB.INDIVIDUAL',
      link: '#',
      show: true,
      id: ProductType.INDIVIDUAL,
    },

    {
      title: 'CONCURRENT_USER.TAB.AGGREGATION',
      link: '#',
      show: true,
      id: ProductType.AGGREGATION,
    },
    {
      title: 'NOMINATIVE_USER.TAB.LOG',
      link: '#',
      show: true,
      id: 'log',
    },
  ];
  activeTitle: ProductType | 'log' = this.individualType;

  get displayedColumns(): string[] {
    return this.columns.map((col: AdvanceSearchField) => col.key);
  }

  get individualType(): ProductType {
    return ProductType.INDIVIDUAL;
  }

  get aggregationType(): ProductType {
    return ProductType.AGGREGATION;
  }

  get logType(): 'log' {
    return 'log';
  }

  constructor(
    private productService: ProductService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private cs: CommonService,
    private reportService: ReportService,
    private ds: DataManagementService
  ) { }
  ngAfterViewInit(): void { }

  ngOnInit(): void {
    this.sharedService.httpLoading().subscribe((isLoading: boolean) => {
      this._loading = isLoading;
    });

    this.checkForChange();
  }

  get isDataAvailable(): boolean {
    return !!(
      this.activeTitle === this.individualType
        ? this.individualNominativeUser
        : this.aggregationNominativeUser
    )?.nominativeUsersList?.filteredData?.length;
  }

  addNominativeUser(): void {
    this.dialog
      .open(AddNominativeUserDialogComponent, {
        ...this.dialogSetting,
        data: {
          activeTitle: this.activeTitle,
          editData: null,
        },
      })
      .afterClosed()
      .subscribe((success: boolean) => {
        if (success) {
          switch (this.activeTitle) {
            case this.individualType:
              this.individualNominativeUser.getNominativeUserList();
              break;
            case this.aggregationType:
              this.aggregationNominativeUser.getNominativeUserList();
              break;
          }

        }
      });
  }

  exportNominativeUser(): void {
    if (this.inProcess || !this.isDataAvailable) return;

    const params: NominativeUsersExportParams = {
      sort_by: 'aggregation_name',
      sort_order: 'asc',
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      is_product: this.activeTitle === this.individualType,
    };
    this.inProcess = true;

    this.productService.getNominativeUserExport(params).subscribe(
      (res: NominativeUserListResponse) => {
        const reportContents: NominativeUserList[] = res.nominative_user;
        const headerList: string[] = [];
        for (var k in reportContents[0]) headerList.push(k);
        const fields: AdvanceSearchField[] =
          this.activeTitle === this.individualType
            ? this.individualNominativeUser.columns
            : this.aggregationNominativeUser.columns;

        const translations: object = fields.reduce(
          (translations: object, field: AdvanceSearchField) => {
            if (field?.show !== false) translations[field.key] = field.label;
            return translations;
          },
          {}
        );

        const downloadInput: DownloadInput = {
          data: reportContents,
          headerList: Object.keys(translations),
          filename: `Report_nominative_users_${this.activeTitle === this.individualType
            ? 'nominative'
            : 'aggregation'
            }`,
          formatType: 'CSV',
          translations,
        };
        this.reportService.downloadFile(downloadInput);
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

  private checkForChange(): void {
    this.subs.add(
      this.ds.isTriggeredNavToLog().subscribe((changed: boolean) => {
        this.activeTitle = 'log';
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

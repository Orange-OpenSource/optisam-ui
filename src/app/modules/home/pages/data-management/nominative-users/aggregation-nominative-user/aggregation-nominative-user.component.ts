import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  NominativeUserList,
  ErrorResponse,
  AdvanceSearchField,
  AdvanceSearchModel,
  NominativeUserListParams,
  NominativeUserListResponse,
  PaginationEvent,
  ProductType,
  TableSortOrder,
} from '@core/modals';
import { ProductService, CommonService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';
import { Observable } from 'rxjs';
import { AddNominativeUserDialogComponent } from '../add-nominative-user-dialog/add-nominative-user-dialog.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-aggregation-nominative-user',
  templateUrl: './aggregation-nominative-user.component.html',
  styleUrls: ['./aggregation-nominative-user.component.scss'],
})
export class AggregationNominativeUserComponent implements OnInit, AfterViewInit {
  @Input() activeTitle: ProductType = null;
  _loading: boolean = false;
  length: number = 0;
  pageSizeOption: number[] = [50, 100, 200];
  pageSize: number = this.pageSizeOption[0];
  dialogSetting: MatDialogConfig = {
    disableClose: true,
    minWidth: '600px',
    width: '80vw',
  };

  nominativeUserData$: Observable<
    MatTableDataSource<NominativeUserList> | ErrorResponse
  >;

  columns: AdvanceSearchField[] = [
    {
      key: 'aggregation_name',
      label: 'NOMINATIVE_USER.TABLE_HEADER.AGGREGATION',
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
    {
      key: 'action',
      label: 'NOMINATIVE_USER.TABLE_HEADER.ACTIONS',
      show: false,
    },
  ];

  advanceSearchModel: AdvanceSearchModel = {
    title: 'NOMINATIVE_USER.TITLE.SEARCH_BY_AGGREGATION',
    primary: 'aggregation_name',
    other: this.columns,
    translate: true,
  };
  currentPageNumber: number = 1;
  listLoading: boolean = false;
  nominativeUsersList: MatTableDataSource<NominativeUserList> =
    new MatTableDataSource([]);
  searchFields: any;
  sortBy: string = 'aggregation_name';
  sortOrder: TableSortOrder = TableSortOrder.ASC;

  get displayedColumns(): string[] {
    return this.columns.map((col: AdvanceSearchField) => col.key);
  }

  constructor(
    private productService: ProductService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private cs: CommonService
  ) { }

  ngAfterViewInit(): void {
    console.table({
      length: this.length,
      pageSize: this.pageSize,
      pageSizeOption: this.pageSizeOption,
      currentPageNumber: this.currentPageNumber
    })
  }

  ngOnInit(): void {
    this.sharedService.httpLoading().subscribe((status: boolean) => {
      this._loading = status;
      this.cd.detectChanges();
    });
    this.getNominativeUserList();
  }

  get getFilter(): NominativeUserListParams {
    return {
      page_num: this.currentPageNumber,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      is_product: false,
      ...(this.searchFields?.activation_date?.trim() && {
        'search_params.activation_date':
          this.searchFields.activation_date?.trim(),
      }),
      // ...(this.searchFields?.editor?.trim() && {
      //   'search_params.editor_name.filteringkey': this.searchFields.editor?.trim(),
      // }),
      ...(this.searchFields?.first_name?.trim() && {
        'search_params.first_name.filteringkey':
          this.searchFields.first_name?.trim(),
      }),
      ...(this.searchFields?.aggregation_name?.trim() && {
        'search_params.aggregation_name.filteringkey':
          this.searchFields.aggregation_name?.trim(),
      }),

      ...(this.searchFields?.product_name?.trim() && {
        'search_params.product_name.filteringkey':
          this.searchFields.product_name?.trim(),
      }),
      ...(this.searchFields?.product_version?.trim() && {
        'search_params.product_version.filteringkey':
          this.searchFields.product_version?.trim(),
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

  getNominativeUserList(): void {
    this.listLoading = true;
    this.nominativeUsersList = new MatTableDataSource([]);
    this.productService.getNominativeUserList(this.getFilter).subscribe(
      (res: NominativeUserListResponse) => {
        this.listLoading = false;
        this.nominativeUsersList = new MatTableDataSource(res.nominative_user);
        this.length = res.totalRecords;
        this.cd.detectChanges();
      },
      ({ message }: ErrorResponse) => {
        this.listLoading = false;
        this.cd.detectChanges();
      }
    );
  }

  getPaginatorData(paginationData: PaginationEvent): void {
    this.pageSize = paginationData.pageSize;
    this.currentPageNumber = +paginationData.pageIndex + 1;
    this.getNominativeUserList();
  }

  advSearchTrigger(event: any): void {
    this.searchFields = event;
    this.currentPageNumber = 1;
    this.getNominativeUserList();
  }

  sortData(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = <TableSortOrder>sort.direction;
    this.getNominativeUserList();
  }

  addNominativeUser(): void {
    this.dialog
      .open(AddNominativeUserDialogComponent, {
        ...this.dialogSetting,
        data: { editData: null, activeTitle: this.activeTitle },
      })
      .afterClosed()
      .subscribe((success: boolean) => {
        success && this.getNominativeUserList();
      });
  }

  editUser(nominativeUser: NominativeUserList): void {
    this.dialog
      .open(AddNominativeUserDialogComponent, {
        ...this.dialogSetting,
        data: { editData: nominativeUser, activeTitle: this.activeTitle },
      })
      .afterClosed()
      .subscribe((success: boolean) => {
        success && this.getNominativeUserList();
      });
  }

  confirmDeleteUser(nominativeUser: NominativeUserList): void {
    this.sharedService
      .commonPopup({
        title: 'NOMINATIVE_USER.TITLE.CONFIRMATION',
        singleButton: false,
        buttonText: 'NOMINATIVE_USER.BUTTON.YES',
        message: 'NOMINATIVE_USER.MESSAGE.USER_DELETION_CONFIRMATION',
      })
      .afterClosed()
      .subscribe((status: boolean) => {
        return status && this.deleteUser(nominativeUser);
      });
  }

  deleteUser(nominativeUser: NominativeUserList): void {
    this.productService.deleteNominativeUser(nominativeUser.id).subscribe(
      ({ success }: { success: boolean }) => {
        if (success)
          this.sharedService
            .commonPopup({
              title: 'NOMINATIVE_USER.TITLE.SUCCESS',
              singleButton: true,
              buttonText: 'NOMINATIVE_USER.BUTTON.OK',
              message: 'NOMINATIVE_USER.MESSAGE.USER_DELETION_SUCCESS',
            })
            .afterClosed()
            .subscribe((status: boolean) => {
              if (status) this.getNominativeUserList();
            });
      },
      (error: ErrorResponse) => {
        this.sharedService.commonPopup({
          title: 'NOMINATIVE_USER.TITLE.ERROR',
          singleButton: true,
          buttonText: 'NOMINATIVE_USER.BUTTON.OK',
          message: error.message,
        });
      }
    );
  }
}

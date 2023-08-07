import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  ConcurrentUserList,
  ErrorResponse,
  AdvanceSearchField,
  AdvanceSearchModel,
  ConcurrentUserListParams,
  ConcurrentUserListResponse,
  PaginationEvent,
  TableSortOrder,
} from '@core/modals';
import { ProductService, CommonService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';
import { Observable } from 'rxjs';
import { AddConcurrentUsersDialogComponent } from '../add-concurrent-users-dialog/add-concurrent-users-dialog.component';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-aggregation-concurrent-user',
  templateUrl: './aggregation-concurrent-user.component.html',
  styleUrls: ['./aggregation-concurrent-user.component.scss'],
})
export class AggregationConcurrentUserComponent implements OnInit {
  @Input() activeTitle: string = null;
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
    {
      key: 'aggregation_name',
      label: 'CONCURRENT_USER.TABLE_HEADER.AGGREGATION',
    },
    { key: 'profile_user', label: 'CONCURRENT_USER.TABLE_HEADER.PROFILE' },
    { key: 'team', label: 'CONCURRENT_USER.TABLE_HEADER.TEAM' },
    {
      key: 'purchase_date',
      label: 'CONCURRENT_USER.TABLE_HEADER.LAST_UPDATE',
      type: 'date',
    },
    {
      key: 'number_of_users',
      label: 'CONCURRENT_USER.TABLE_HEADER.NUMBER_OF_USERS',
    },
    {
      key: 'action',
      label: 'CONCURRENT_USER.TABLE_HEADER.ACTIONS',
      show: false,
    },
  ];

  advanceSearchModel: AdvanceSearchModel = {
    title: 'CONCURRENT_USER.TITLE.SEARCH_TITLE_AGGREGATION',
    primary: 'aggregation_name',
    other: this.columns,
  };
  currentPageNumber: number = 1;
  concurrentUsersList: MatTableDataSource<ConcurrentUserList> =
    new MatTableDataSource([]);
  sortBy: string = 'aggregation_name';
  sortOrder: TableSortOrder = TableSortOrder.ASC;
  searchFields: any;
  listLoading: boolean = false;

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

  ngOnInit(): void {
    this.sharedService.httpLoading().subscribe((isLoading: boolean) => {
      this._loading = isLoading;
      this.cd.detectChanges();
    });
    this.getConcurrentUserList();
  }

  get getFilter(): ConcurrentUserListParams {
    return {
      page_num: this.currentPageNumber,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      is_aggregation: true,

      ...(this.searchFields?.number_of_users?.trim() && {
        'search_params.number_of_users.filteringkey':
          this.searchFields.number_of_users?.trim(),
      }),

      ...(this.searchFields?.aggregation_name?.trim() && {
        'search_params.aggregation_name.filteringkey':
          this.searchFields.aggregation_name?.trim(),
      }),
      ...(this.searchFields?.team?.trim() && {
        'search_params.team.filteringkey': this.searchFields.team?.trim(),
      }),
      ...(this.searchFields?.profile_user?.trim() && {
        'search_params.profile_user.filteringkey':
          this.searchFields.profile_user?.trim(),
      }),
      ...(this.searchFields?.purchase_date?.trim() && {
        'search_params.purchase_date': this.searchFields.purchase_date?.trim(),
      }),
    };
  }

  getConcurrentUserList(): void {
    this.listLoading = true;
    this.concurrentUsersList = new MatTableDataSource([]);
    this.productService.getConcurrentUserList(this.getFilter).subscribe(
      (res: ConcurrentUserListResponse) => {
        this.listLoading = false;
        this.concurrentUsersList = new MatTableDataSource(res.concurrent_user);
        this.length = res.totalRecords;
      },
      (e: ErrorResponse) => {
        this.listLoading = false;
        this.sharedService.commonPopup({
          title: 'CONCURRENT_USER.TITLE.ERROR',
          singleButton: true,
          message: e.message,
          buttonText: 'CONCURRENT_USER.BUTTON.OK',
        });
      }
    );
  }

  getPaginatorData(paginationData: PaginationEvent): void {
    this.pageSize = paginationData.pageSize;
    this.currentPageNumber = ++paginationData.pageIndex;
    console.table(paginationData);
    this.getConcurrentUserList();
  }

  advSearchTrigger(event: any): void {
    this.searchFields = event;
    this.currentPageNumber = 1;
    this.getConcurrentUserList();
  }

  sortData(sort: Sort) {
    this.sortBy = sort.active;
    this.sortOrder = <TableSortOrder>sort.direction;
    this.getConcurrentUserList();
  }

  addConcurrentUser(): void {
    this.dialog
      .open(AddConcurrentUsersDialogComponent, this.dialogSetting)
      .afterClosed()
      .subscribe((status: boolean) => {
        this.getConcurrentUserList();
      });
  }

  editUser(concurrentUser: ConcurrentUserList): void {
    this.dialog
      .open(AddConcurrentUsersDialogComponent, {
        ...this.dialogSetting,
        data: { activeTitle: this.activeTitle, editData: concurrentUser },
      })
      .afterClosed()
      .subscribe((status: boolean) => {
        status && this.getConcurrentUserList();
      });
  }

  confirmDeletion(concurrentUser: ConcurrentUserList): void {
    this.sharedService
      .commonPopup({
        title: 'CONCURRENT_USER.TITLE.CONFIRMATION',
        message: 'CONCURRENT_USER.MESSAGE.DELETION_CONFIRMATION',
        singleButton: false,
        buttonText: 'CONCURRENT_USER.BUTTON.OK',
      })
      .afterClosed()
      .subscribe((response: boolean) => {
        response && this.deleteProduct(concurrentUser);
      });
  }

  deleteProduct({ id }: ConcurrentUserList): void {
    const currentScope: string = this.cs.getLocalData(LOCAL_KEYS.SCOPE);
    this.productService.deleteConcurrentUserProduct(id, currentScope).subscribe(
      ({ success }: { success: boolean }) => {
        if (success)
          this.sharedService
            .commonPopup({
              message: 'CONCURRENT_USER.MESSAGE.DELETION_SUCCESS',
              title: 'CONCURRENT_USER.TITLE.SUCCESS',
              singleButton: true,
              buttonText: 'CONCURRENT_USER.BUTTON.OK',
            })
            .afterClosed()
            .subscribe((res: boolean) => {
              res && this.getConcurrentUserList();
            });
      },
      (e: ErrorResponse) => {
        this.sharedService.commonPopup({
          title: 'CONCURRENT_USER.TITLE.ERROR',
          message: e.message,
          singleButton: true,
          buttonText: 'CONCURRENT_USER.BUTTON.OK',
        });
      }
    );
  }
}

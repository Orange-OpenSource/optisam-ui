import { CommonService } from '@core/services/common.service';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  UserCountDetailData,
} from '@core/modals';
import { ProductService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';
import { Observable } from 'rxjs';
import { AddNominativeUserDialogComponent } from '../add-nominative-user-dialog/add-nominative-user-dialog.component';
import { Sort } from '@angular/material/sort';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-individual-nominative-user',
  templateUrl: './admin-individual-nominative-user.component.html',
  styleUrls: ['./admin-individual-nominative-user.component.scss'],
})
export class AdminIndividualNominativeUserComponent
  implements OnInit, OnDestroy {
  @Input() activeTitle: ProductType = null;
  _loading: boolean = false;
  length: number;
  pageSizeOption: number[] = [50, 100, 200];
  pageSize: number = this.pageSizeOption[0];
  sortBy: string = 'product_name';
  sortOrder: TableSortOrder = TableSortOrder.ASC;
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
      key: 'editor',
      label: 'NOMINATIVE_USER.TABLE_HEADER.EDITOR',
      show: true,
    },
    { key: 'product_name', label: 'NOMINATIVE_USER.TABLE_HEADER.PRODUCT' },
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
      type: 'date',
    },
    {
      key: 'action',
      label: 'NOMINATIVE_USER.TABLE_HEADER.ACTIONS',
      show: false,
    },
  ];

  advanceSearchModel: AdvanceSearchModel = {
    title: 'NOMINATIVE_USER.TITLE.SEARCH_BY_PRODUCT',
    primary: 'product_name',
    other: this.columns,
    translate: true,
  };
  currentPageNumber: number = 1;
  nominativeUsersList: MatTableDataSource<NominativeUserList> =
    new MatTableDataSource([]);
  listLoading: boolean = false;
  searchFields: any;
  subs: SubSink = new SubSink();

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
    this.getStreamingData();
    this.getNominativeUserList();
    // this.addNominativeUser();
  }

  get getFilter(): NominativeUserListParams {
    return {
      page_num: this.currentPageNumber,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      is_product: true,
      ...(this.searchFields?.activation_date?.trim() && {
        'search_params.activation_date':
          this.searchFields.activation_date?.trim(),
      }),
      ...(this.searchFields?.editor?.trim() && {
        'search_params.editor.filteringkey': this.searchFields.editor?.trim(),
      }),
      ...(this.searchFields?.first_name?.trim() && {
        'search_params.first_name.filteringkey':
          this.searchFields.first_name?.trim(),
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
        this.nominativeUsersList = new MatTableDataSource(res.nominative_user);
        this.length = res.totalRecords;
        this.listLoading = false;
        this.cd.detectChanges();
      },
      (e: ErrorResponse) => {
        this.listLoading = false;
        this.sharedService.commonPopup({
          title: 'ERROR_TITLE',
          singleButton: true,
          message: e.message,
          buttonText: 'OK',
        });
        this.cd.detectChanges();
      }
    );
  }

  getPaginatorData(paginationData: PaginationEvent): void {
    this.pageSize = paginationData.pageSize;
    this.currentPageNumber = paginationData.pageIndex + 1;
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

  addNominativeUser(nominativeUser: NominativeUserList = null): void {
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

  editUser(nominativeUser: NominativeUserList = null): void {
    this.addNominativeUser(nominativeUser);
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
    console.log('id', nominativeUser);
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
        console.log({ error });
        this.sharedService.commonPopup({
          title: 'NOMINATIVE_USER.TITLE.ERROR',
          singleButton: true,
          buttonText: 'NOMINATIVE_USER.BUTTON.OK',
          message: error.message,
        });
      }
    );
  }

  getStreamingData(): void {
    // Http loading
    this.subs.add(
      this.sharedService.httpLoading().subscribe((status: boolean) => {
        this._loading = status;
        this.cd.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

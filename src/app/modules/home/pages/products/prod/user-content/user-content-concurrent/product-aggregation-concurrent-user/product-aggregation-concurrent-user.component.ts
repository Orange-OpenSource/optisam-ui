import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  ConcurrentUserListParams,
  ConcurrentUserListResponse,
  ConcurrentUserList,
  UserIndividualCountDetailData,
  UserAggregationCountDetailData,
  ProductAggregation,
  ConcurrentUserHistoryResponse,
  ConcurrentUserHistorySet,
  ConcurrentUserHistoryParams,
} from '@core/modals';
import { ProductService, CommonService } from '@core/services';
import { LOCAL_KEYS, MONTH_COLOR_SET } from '@core/util/constants/constants';
import { AddNominativeUserDialogComponent } from '@home/pages/data-management/nominative-users/add-nominative-user-dialog/add-nominative-user-dialog.component';
import { SharedService } from '@shared/shared.service';
import { format, addMonths, subMonths } from 'date-fns';
import { Observable, Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import * as Chart from 'chart.js';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { _sString } from '@core/util/common.functions';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-product-aggregation-concurrent-user',
  templateUrl: './product-aggregation-concurrent-user.component.html',
  styleUrls: ['./product-aggregation-concurrent-user.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ProductAggregationConcurrentUserComponent
  implements OnInit, AfterViewInit {
  canvasHeight: number = 180;
  date = new FormControl(moment());
  _loading: boolean = false;
  length: number = 1;
  tabMenus: TabMenu;
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
      label: 'CONCURRENT_USER.TABLE_HEADER.AGGREGATION',
      show: false,
    },
    {
      key: 'profile_user',
      label: 'CONCURRENT_USER.TABLE_HEADER.PROFILE',
    },
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
  ];

  advanceSearchModel: AdvanceSearchModel = {
    title: 'CONCURRENT_USER.TITLE.USER_SEARCH_TITLE',
    primary: 'profile_user',
    other: this.columns,
    translate: true,
  };
  currentPageNumber: number = 1;
  concurrentUsersList: MatTableDataSource<ConcurrentUserList> =
    new MatTableDataSource([]);
  subs: SubSink = new SubSink();
  productType: ProductType = null;
  aggregation: ProductAggregation;
  sortBy: string = 'purchase_date';
  sortOder: SortDirection = 'asc';
  listLoading: boolean = false;
  searchFields: any;
  startDate: any;
  endDate: any;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasId: string = 'user-history-graph';
  historyData: any = null;
  historyOptions: any = null;
  graphDataSub!: Subscription;

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
  }

  ngAfterViewInit(): void { }

  get isAggregation(): boolean {
    return this.productType === ProductType.AGGREGATION;
  }

  get filters(): ConcurrentUserListParams {
    return <ConcurrentUserListParams>{
      page_num: this.currentPageNumber,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOder,
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      is_aggregation: this.isAggregation,
      'search_params.aggregation_name.filteringkey':
        this.aggregation?.aggregation_name,
      'search_params.aggregation_name.filter_type': true,
      ...(this.searchFields?.team?.trim() && {
        'search_params.team.filteringkey': this.searchFields.team?.trim(),
      }),
      ...(this.searchFields?.profile_user?.trim() && {
        'search_params.profile_user.filteringkey':
          this.searchFields.profile_user?.trim(),
      }),
      ...(this.searchFields?.number_of_users?.trim() && {
        'search_params.number_of_users.filteringkey':
          this.searchFields.number_of_users?.trim(),
      }),
      ...(this.searchFields?.purchase_date?.trim() && {
        'search_params.purchase_date': this.searchFields.purchase_date?.trim(),
      }),
    };
  }

  private getConcurrentUserList(): void {
    this.listLoading = true;
    this.concurrentUsersList = new MatTableDataSource([]);
    this.productService.getConcurrentUserList(this.filters).subscribe(
      (res: ConcurrentUserListResponse) => {
        this.listLoading = false;
        this.concurrentUsersList = new MatTableDataSource(res.concurrent_user);
        this.length = res.totalRecords;
        this.getGraphData();
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
    this.getConcurrentUserList();
  }

  advSearchTrigger(searchData: any): void {
    this.searchFields = searchData;
    this.currentPageNumber = 1;
    this.getConcurrentUserList();
  }

  sortData(sort: Sort): void {
    this.sortBy = sort.active;
    this.sortOder = sort.direction;
    this.getConcurrentUserList();
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
          this.aggregation = userCountDetailData?.product;
          this.getConcurrentUserList();
        })
    );
  }

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.getGraphData();
  }

  private getGraphData(): void {
    if (this.graphDataSub) this.graphDataSub.unsubscribe();
    this.endDate = new Date(this.date.value.toISOString());
    this.startDate = subMonths(this.endDate, 11);
    const params: ConcurrentUserHistoryParams = {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      aggID: this.aggregation?.ID,
      start_date: this.startDate.toISOString(),
      end_date: this.endDate.toISOString(),
    };
    this.graphDataSub = this.productService
      .getConcurrentUsersHistory(params)
      .subscribe((res: ConcurrentUserHistoryResponse) => {
        this.graphDataSub = null;
        this.generateGraph(res);
      });
  }

  private generateGraph(res: ConcurrentUserHistoryResponse): void {
    this.resetCanvas();
    const monthDataset: string[] = this.getMonthDataset();
    const userDataset: number[] = this.getUserDataset(
      res.concurrentUsersByMonths,
      monthDataset
    );
    const backgroundColors: string[] = this.getColorSet(monthDataset);

    this.canvas = document.getElementById(this.canvasId) as HTMLCanvasElement;

    this.historyData = {
      labels: monthDataset,
      datasets: [
        {
          data: userDataset,
          backgroundColor: backgroundColors,
        },
      ],
    };

    this.historyOptions = {
      legend: { display: false },
      responsive: true,
      maintainAspectRatio: false,
      display: true,
      plugins: {
        labels: false,
      },
      scales: {
        yAxes: [
          {
            display: true,
            ticks: {
              suggestedMin: 0, // minimum will be 0, unless there is a lower value.
              // OR //
              beginAtZero: true, // minimum value will be 0.
              userCallback: function (label, index, labels) {
                // when the floored value is the same as the value we have a whole number
                if (Math.floor(label) === label) {
                  return label;
                }
              },
            },
          },
        ],
      },
    };

    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      const myChart = new Chart(this.ctx, {
        type: 'bar',
        data: this.historyData,
        options: this.historyOptions,
      });
    }
  }

  private resetCanvas(): void {
    if (this.canvas) {
      this.canvas.remove();
      document.getElementById(
        'graph-section'
      ).innerHTML = `<canvas id="${this.canvasId}" height="${this.canvasHeight}" ></canvas>`;
    }
  }

  private getColorSet(months: string[]): string[] {
    return months.reduce((set: string[], month: string) => {
      if (month) {
        set.push(MONTH_COLOR_SET[month?.trim()?.split(' ')?.[0] || 'January']);
        return set;
      }
      set.push(MONTH_COLOR_SET['January']);
      return set;
    }, []);
  }

  private getMonthDataset(): string[] {
    let timeCounter: number = this.startDate.getTime();
    const monthSet: string[] = [];

    while (timeCounter <= this.endDate.getTime()) {
      monthSet.push(format(timeCounter, 'MMMM yyyy'));
      timeCounter = addMonths(new Date(timeCounter), 1).getTime(); // adding 1 month format he timeCounter
    }
    return monthSet;
  }

  private getUserDataset(
    concurrentUsersByMonths: ConcurrentUserHistorySet[],
    monthDateset: string[]
  ): number[] {
    return monthDateset.reduce((dataset: number[], month: string) => {
      let data: number = 0;
      data =
        concurrentUsersByMonths.find(
          (usersSet: ConcurrentUserHistorySet) =>
            _sString(usersSet.purchase_month) === _sString(month)
        )?.concurrent_users || 0;
      dataset.push(data);
      return dataset;
    }, []);
  }

  detectEndMonthChange(value: any): void {
    console.log(value);
  }

  closeEndDatepicker(event: any): void {
    console.log({ event });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

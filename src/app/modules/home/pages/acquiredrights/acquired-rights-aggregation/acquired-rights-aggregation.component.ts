import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  trigger,
  style,
  state,
  animate,
  transition,
} from '@angular/animations';
import { MoreDetailsComponent } from '../../../dialogs/product-details/more-details.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductAggregationDetailsComponent } from '../../../dialogs/product-aggregation-details/product-aggregation-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import {
  AcquiredRightAggregationQuery,
  AggregatedAcquiredRights,
  ErrorResponse,
} from '@core/modals';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { CommonService } from '@core/services/common.service';
import { AdvanceSearchComponent } from '@shared/advance-search/advance-search.component';
import { Subscription } from 'rxjs';

export interface StateData {
  aggregationName: string;
}

@Component({
  selector: 'app-acquired-rights-aggregation',
  templateUrl: './acquired-rights-aggregation.component.html',
  styleUrls: ['./acquired-rights-aggregation.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', minHeight: '*' })),
      transition('expanded => collapsed', animate('200ms ease-out')),
      transition('collapsed => expanded', animate('200ms ease-in')),
    ]),
  ],
})
export class AcquiredRightsAggregationComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(AdvanceSearchComponent) advanceSearch: AdvanceSearchComponent;
  private getAggregationSub: Subscription;
  public searchValue: any = {};
  arAggregationData: any;
  searchKey: string;
  swidTag: any;
  length;
  pageSize = 50;
  sort_order: any;
  sort_by: any;
  selected: any;
  page_size: any;
  pageEvent: any;
  current_page_num: any;
  filteringOrder: any;
  stateData: StateData;
  productsListByAggrID: any[];

  displayedColumns: string[] = [
    'sku',
    'corporate_sourcing_contract',
    'ordering_date',
    'swidtags',
    'aggregation_name',
    'product_editor',
    'software_provider',
    'metric_name',
    'num_licenses_acquired',
    'num_licences_maintenance',
    'start_of_maintenance',
    'end_of_maintenance',
    'licence_under_maintenance',
    'avg_unit_price',
    'avg_maintenance_unit_price',
    'total_purchase_cost',
    'total_maintenance_cost',
    'total_cost',
    'last_purchased_order',
    'support_number',
    'maintenance_provider',
    'comment',
  ];
  expandDisplayedColumns: string[] = [
    'SKU',
    'corporate_sourcing_contract',
    'ordering_date',
    'swid_tag',
    'product_name',
    'version',
    'editor',
    'software_provider',
    'metric',
    'acquired_licenses_number',
    'licenses_under_maintenance_number',
    'start_of_maintenance',
    'end_of_maintenance',
    'licenses_under_maintenance',
    'avg_licenes_unit_price',
    'avg_maintenance_unit_price',
    'total_purchase_cost',
    'total_maintenance_cost',
    'total_cost',
    'last_purchased_order',
    'support_number',
    'maintenance_provider',
    'comment',
  ];
  sortColumn: string[] = [
    'aggregation_name',
    'product_editor',
    'ordering_date',
    'metric_name',
    'total_cost',
    'sku',
    'software_provider',
    'swidtags',
    'num_licenses_acquired',
    'licence_under_maintenance',
    'start_of_maintenance',
    'end_of_maintenance',
    'avg_unit_price',
    'licence_under_maintenance',
    'num_licences_maintenance',
    'avg_maintenance_unit_price',
    'total_purchase_cost',
    'total_maintenance_cost',
    'last_purchased_order',
    'support_number',
    'maintenance_provider',
  ];

  tableKeyLabelMap: any = {
    sku: 'SKU',
    SKU: 'SKU',
    corporate_sourcing_contract: 'CSC',
    ordering_date: 'Ordering Date',
    software_provider: 'Software Provider',
    last_purchased_order: 'Last Purchased Order',
    support_number: 'Support Number',
    maintenance_provider: 'Maintenance Provider',
    swid_tag: 'SwidTag',
    product_name: 'Product name',
    version: 'Version',
    editor: 'Editor',
    metric: 'Metric',
    acquired_licenses_number: 'Acquired licenses',
    licenses_under_maintenance_number: 'Licenses under maintenance number',
    swidtags: 'Number of Swidtags',
    aggregation_name: 'Aggregation Name',
    product_editor: 'Editor',
    metric_name: 'Metric(s)',
    num_licenses_acquired: 'Acquired licenses',
    num_licences_maintenance: 'Licenses under maintenance number',
    start_of_maintenance: 'Start of Maintenance',
    end_of_maintenance: 'End of Maintenance',
    licence_under_maintenance: 'License under maintenance',
    licenses_under_maintenance: 'License under maintenance',
    avg_licenes_unit_price: 'Avg License unit price',
    avg_unit_price: 'Unit Price',
    avg_maintenance_unit_price: 'Maintenance Price',
    total_purchase_cost: 'Total purchase cost',
    total_maintenance_cost: 'Total maintenance cost',
    total_cost: 'Total cost',
    comment: 'Comment',
  };
  _loading: Boolean;

  advanceSearchModel: any = {
    title: 'Search by Aggregation Name',
    primary: 'search_params.name.filteringkey',
    other: [
      { key: 'search_params.SKU.filteringkey', label: 'SKU' },
      { key: 'search_params.name.filteringkey', label: 'Aggregation Name' },
      { key: 'search_params.editor.filteringkey', label: 'Editor Name' },
      { key: 'search_params.metric.filteringkey', label: 'Metric' },
      {
        key: 'search_params.software_provider.filteringkey',
        label: 'Software Provider',
      },
      {
        key: 'search_params.ordering_date.filteringkey',
        label: 'Ordering Date',
        type: 'date',
      },
    ],
  };
  searchFields: any = {};
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  expandedRow: any;
  searchQuery: any = {};
  sortQuery: any = {};

  constructor(
    private productService: ProductService,
    private route: Router,
    public dialog: MatDialog,
    private cs: CommonService
  ) {
    // console.log(this.route.getCurrentNavigation().extras.state);
    this.stateData = <StateData>this.route.getCurrentNavigation().extras.state;
    if (this.stateData) {
      this.setAggregationName();
    }
    this.current_page_num = 1;
    this.page_size = 50;
  }

  ngOnInit() {
    this.getAcqiredRightsAggregationData();
  }

  ngAfterViewInit(): void {
    this.setAdvanceSearchValue();
  }

  setAdvanceSearchValue(): void {
    if (this.advanceSearch?.filterFields) {
      this.advanceSearch.filterFields = {
        ...this.advanceSearch.filterFields,
        ...(this.stateData && {
          'search_params.name.filteringkey': this.stateData.aggregationName,
        }),
      };
      if (this.stateData) this.advanceSearch.applyFilter();
    }
  }

  getAcqiredRightsAggregationData() {
    if (this.getAggregationSub) this.getAggregationSub.unsubscribe();
    this._loading = true;
    this.sortQuery = Object.keys(this.sortQuery).length
      ? this.sortQuery
      : { sort_order: 'asc' };
    this.searchQuery = Object.keys(this.searchQuery).length
      ? this.searchQuery
      : { sort_by: 'AGG_NAME' };
    let query: AcquiredRightAggregationQuery = {
      page_num: this.current_page_num,
      page_size: this.page_size,
      scope: [this.cs.getLocalData(LOCAL_KEYS.SCOPE)],
      ...this.sortQuery,
      ...this.searchQuery,
    };

    this.getAggregationSub = this.productService
      .getAggregationAcquiredRights(query)
      .subscribe(
        (res: AggregatedAcquiredRights) => {
          this.arAggregationData = new MatTableDataSource(res.aggregations);
          // this.arAggregationData.sort = this.sort;
          this.length = res.totalRecords;
          this._loading = false;
        },
        (error: ErrorResponse) => {
          this._loading = false;
        }
      );
  }

  setAggregationName(): void {
    // advance search
  }

  getPaginatorData(ev) {
    this.page_size = ev.pageSize;
    this.current_page_num = ev.pageIndex + 1;
    this.getAcqiredRightsAggregationData();
  }

  sortData(ev) {
    if (!ev.direction) {
      return false;
    }
    this.searchQuery = {};
    this.sortQuery = { sort_order: ev.direction.toLowerCase() };
    let sortBy: string = '';
    switch (ev.active) {
      case 'aggregation_name':
        sortBy = 'AGG_NAME';
        break;

      case 'product_editor':
        sortBy = 'EDITOR';
        break;

      case 'metric_name':
        sortBy = 'METRIC';
        break;

      case 'swidtags':
        sortBy = 'NUM_OF_SWIDTAGS';
        break;

      case 'num_licenses_acquired':
        sortBy = 'ACQUIRED_LICENSES';
        break;

      case 'licence_under_maintenance':
        sortBy = 'MAINTENANCE_LICENCES';
        break;
      case 'start_of_maintenance':
        sortBy = 'MAINTENANCE_START';
        break;
      case 'end_of_maintenance':
        sortBy = 'MAINTENANCE_END';
        break;
      case 'avg_unit_price':
        sortBy = 'UNIT_PRICE';
        break;
      case 'avg_maintenance_unit_price':
        sortBy = 'MAINTENANCE_PRICE';
        break;
      case 'total_purchase_cost':
        sortBy = 'TOTAL_PURCHASED_COST';
        break;
      case 'total_maintenance_cost':
        sortBy = 'TOTAL_MAINTENANCE_COST';
        break;
      case 'num_licences_maintenance':
        sortBy = 'MAINTENANCE_LICENCES';
        break;

      case 'sku':
      case 'total_cost':
        sortBy = ev.active.toUpperCase();
        break;

      default:
        break;
    }

    this.searchQuery = { ...this.searchQuery, sort_by: sortBy };
    this.getAcqiredRightsAggregationData();
  }

  getJoinedString(arr: any[], key: string, joinString: string) {
    return arr.map((d) => d[key]).join(joinString);
  }

  applyFilter() {
    this._loading = true;
    this.arAggregationData = null;
    if (this.current_page_num === 0) {
      this.current_page_num = 1;
    }
    this.searchQuery = {};
    Object.keys(this.searchFields).forEach((key) => {
      if (this.searchFields[key]) {
        this.searchQuery = {
          ...this.searchQuery,
          [key]: this.searchFields[key].trim(),
        };
      }
    });
    this.getAcqiredRightsAggregationData();
  }

  advSearchTrigger(event) {
    this.searchFields = event;
    this.applyFilter();
  }

  getProductDetails(aggrights) {
    this._loading = true;
    this.productService
      .getProductsByAggrID(aggrights.aggregation_name, aggrights.metric_name)
      .subscribe(
        (res) => {
          this.productsListByAggrID = res.acqRights;
          this._loading = false;
        },
        (err) => {
          console.log('Products could not be fetched!');
          this._loading = false;
        }
      );
  }

  openAggregationDetailsDialog(aggregation: any): void {
    const dialogRef = this.dialog.open(ProductAggregationDetailsComponent, {
      width: '1300px',
      autoFocus: false,
      disableClose: true,
      data: {
        productName: aggregation.product_names,
        aggregationName: aggregation.aggregation_name,
        aggregationID: aggregation.ID,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  downloadFile(sku, fileName) {
    // const filePath = file.error_file_api.slice(8);
    this.productService.getAggregationDownloadFile(sku).subscribe(
      (res) => {
        console.log(res.file_data);

        const url = `data:application/pdf;base64,${res.file_data}`;

        const downloadEl = document.createElement('a');

        downloadEl.href = url;
        downloadEl.download = fileName;
        downloadEl.click();
      }
      // (error) => {
      //   this.errorMsg =
      //     error.error.message ||
      //     'Some error occured! Could not download records for selected global file';
      //   this.openModal(errorMsg);
      //   console.log('Some error occured! Could not download file.', error);
      // }
    );
  }

  openDialog(value, name): void {
    const dialogRef = this.dialog.open(MoreDetailsComponent, {
      width: '850px',
      disableClose: true,
      data: {
        datakey: value,
        dataName: name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  ngOnDestroy(): void {
    this.getAggregationSub.unsubscribe();
  }
}

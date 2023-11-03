import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import {
  AcquiredRightsAggregationParams,
  AggregatedAcquiredRights,
  Aggregation,
} from '@core/modals';
import { CommonService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';

type AlertColor = {
  green: string;
  red: string;
};

const ALERT_COLOR: AlertColor = {
  green: 'alert_green',
  red: 'alert_red',
};

@Component({
  selector: 'app-product-aggregation-details',
  templateUrl: './product-aggregation-details.component.html',
  styleUrls: ['./product-aggregation-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', minHeight: '*' })),
      transition('expanded => collapsed', animate('200ms ease-out')),
      transition('collapsed => expanded', animate('200ms ease-in')),
    ]),
  ],
})
export class ProductAggregationDetailsComponent implements OnInit, OnDestroy {
  value: any;
  pName: any;
  edition: any;
  acquireRight: any;
  productdetails: any;
  aggregationMaintenance: Aggregation = null;
  loadingSubscription: Subscription;
  _loading: Boolean;
  expandedRow: any;
  computationDetails: any;
  aggregationName: any;

  displayedColumns: string[] = [
    'SKU',
    'metric',
    'numCptLicences',
    'computedDetails',
    // 'numAcqLicences',
    'availableLicences',
    // 'sharedLicences',
    // 'recievedLicences',
    'deltaNumber',
    'deltaCost',
    'totalCost',
  ];

  tableKeyLabelMap: any = {
    SKU: 'SKU',
    metric: 'Metrics',
    metric_name: 'Metric',
    numCptLicences: 'Computed licenses',
    computedDetails: 'Computation details',
    // numAcqLicences: 'Acquired Licenses',
    availableLicences: 'Available Licenses',
    // sharedLicences:"Shared Licenses",
    // recievedLicences:"Received Licenses",
    deltaNumber: 'Delta (licenses)',
    deltaCost: 'Delta Cost',
    totalCost: 'Total Cost',
  };

  expandDisplayedColumns: string[] = [
    'blankColumn1',
    'metric_name',
    'numCptLicences',
    'computedDetails',
    'numAcqLicences',
    'deltaNumber',
    'deltaCost',
    'blankColumn2',
  ];
  num_equipments: any;
  alertColor: string = '';
  constructor(
    private productsService: ProductService,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<ProductAggregationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cs: CommonService
  ) {
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((load) => {
        this._loading = load;
      });
  }

  ngOnInit() {
    this.getDetails();
    this.getAcquiredRights();
  }

  // Get aggregation details
  getDetails() {
    this._loading = true;
    this.productsService
      .getAggregationInfoDetails(this.data.aggregationID)
      .subscribe(
        (res: any) => {
          this.productdetails = res;
          this.num_equipments = res.num_equipments;
          this._loading = false;
        },
        (error) => {
          this._loading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        }
      );
  }

  // Get aggregation Maintenance
  getMaintenanceDetails() {
    this._loading = true;
    const params: AcquiredRightsAggregationParams = {
      page_num: 1,
      page_size: 100,
      sort_order: 'asc',
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      'search_params.name.filteringkey': this.data.aggregationName,
      'search_params.SKU.filteringkey': this.data.aggregationSKU,
    };

    this.productsService.getAggregationAcquiredRights(params).subscribe(
      ({ aggregations }: AggregatedAcquiredRights) => {
        this.aggregationMaintenance = aggregations[0];
        this._loading = false;
      },
      (error) => {
        this._loading = false;
        console.log(
          'There was an error while retrieving Posts !!!' + error.message
        );
      }
    );
  }

  get hasCompliance(): boolean {
    return this.acquireRight?.length !== 0;
  }

  // Get acquire rights
  getAcquiredRights() {
    this._loading = true;
    this.productsService
      .getAggregationAquiredRights(this.data.aggregationName)
      .subscribe(
        (res: any) => {
          this.acquireRight = res.acq_rights;

          const anyNegativeDelta: boolean = res.acq_rights.some(
            (ar: any) => ar.deltaCost < 0
          );
          this.alertColor = anyNegativeDelta
            ? ALERT_COLOR.red
            : !!res.acq_rights?.length
              ? ALERT_COLOR.green
              : '';

          if (this.acquireRight?.filteredData?.length > 0) {
            for (var i = 0; i < this.acquireRight.filteredData.length; i++) {
              this.acquireRight.filteredData[i].computedDetails =
                this.acquireRight.filteredData[i].computedDetails
                  .split(',')
                  .join(',\n');
            }
          }
          this.aggregationName = res.aggregationName;
          this._loading = false;
        },
        (error) => {
          this._loading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        }
      );
  }

  expandMetrics(product) {
    this._loading = true;
    this.computationDetails = null;
    this.expandedRow = this.expandedRow === product ? null : product;
    this.productsService
      .getAggregationComputationDetails(this.data.aggregationName, product.SKU)
      .subscribe(
        (res) => {
          this.computationDetails = new MatTableDataSource(
            res.computed_details
          );
          this._loading = false;
        },
        (error) => {
          this._loading = false;
          console.log(
            'There was an error while retrieving Products !!!' + error
          );
        }
      );
  }

  closeMetrics() {
    this.expandedRow = null;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}

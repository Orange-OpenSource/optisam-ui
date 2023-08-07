import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewChild } from '@angular/core';

import {
  trigger,
  style,
  state,
  animate,
  transition,
} from '@angular/animations';

import { ProductService } from 'src/app/core/services/product.service';
import { DialogData } from './details';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ProductAggregationDetailsComponent } from '../product-aggregation-details/product-aggregation-details.component';
import {
  AcquiredRights,
  AcquiredRightsIndividualParams,
  AcquiredRightsResponse,
} from '@core/modals/acquired-rights.modal';
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
  selector: 'app-more-details',
  templateUrl: './more-details.component.html',
  styleUrls: ['./more-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', minHeight: '*' })),
      transition('expanded => collapsed', animate('200ms ease-out')),
      transition('collapsed => expanded', animate('200ms ease-in')),
    ]),
  ],
})
export class MoreDetailsComponent implements OnInit {
  value: any;
  pName: any;
  appID: any;
  edition: any;
  acquireRight: any;
  loadingSubscription: Subscription;
  _loading: Boolean;
  aggExcist: Boolean;
  computationDetails: any;
  agg_name: any;
  expandedRow: any;
  swidTag: any;
  productInfo: DialogData = new DialogData();
  productOptions: DialogData = new DialogData();
  productSKU: string = null;
  emptyMsg: string =
    'The compliance can not be computed because no right has been defined for the product. Please contact your admin to define acquired rights for the product.';

  @ViewChild(MatSort, { static: false }) sort: MatSort;
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
    availableLicences: 'Available Licenses',
    // sharedLicences:"Shared Licenses",
    // recievedLicences:"Received Licenses",
    numAcqLicences: 'Acquired Licenses',
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
  length: any;
  metricSku: any;
  alertColor: string;
  isCostOptimization: boolean = false;
  totalCostOfCostOptimization: number = 0;
  maintenanceInfo: AcquiredRights;
  deltaCostOfCostOptimization: number = 0;

  //new table
  constructor(
    private productsService: ProductService,
    private sharedService: SharedService,
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MoreDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      datakey: string;
      dataName: string;
      dataSKU?: string;
      appID?: string;
    },
    private cs: CommonService
  ) {
    this.loadingSubscription = this.sharedService
      .httpLoading()
      .subscribe((load) => {
        this._loading = load;
      });
  }

  ngOnInit() {
    this.swidTag = this.data.datakey;
    this.pName = this.data.dataName;
    if (this.data.appID) {
      this.appID = this.data.appID;
    } else {
      this.appID = null;
    }
    this.productSKU = this.data.dataSKU || null;
    this.getProductDetails();
    this.getAcquiredRights();
  }

  get hasCompliance(): boolean {
    return this.acquireRight?.filteredData.length !== 0;
  }

  getProductDetails() {
    this._loading = true;
    this.productsService.getMoreDetails(this.swidTag).subscribe(
      (res: any) => {
        console.log(res)
        this.productInfo = res;
        this._loading = false;
      },
      (error) => {
        this._loading = false;
        console.log('There was an error while retrieving Posts !!!' + error);
      }
    );
  }

  openAggregationDetailsDialog(aggregation: any): void {
    const dialogRef = this.dialog.open(ProductAggregationDetailsComponent, {
      width: '850px',
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

  getProductMaintenance() {
    this._loading = true;
    const acquiredRightsIndividualParams: AcquiredRightsIndividualParams = {
      page_num: 1,
      page_size: 50,
      sort_by: 'PRODUCT_NAME',
      sort_order: 'asc',
      scopes: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      'search_params.swidTag.filteringkey': this.swidTag,
      'search_params.SKU.filteringkey': this.productSKU,
    };
    this.productsService
      .filteredDataAcqRights(acquiredRightsIndividualParams)
      .subscribe(
        ({ acquired_rights }: AcquiredRightsResponse) => {
          this.maintenanceInfo = acquired_rights?.[0];
          console.log('maintenanceInfo', this.maintenanceInfo);
          this._loading = false;
        },
        (error) => {
          this._loading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        }
      );
  }

  getAcquiredRights() {
    this._loading = true;
    this.productsService
      .getAcquiredRightDetails(this.swidTag, '', this.appID)
      .subscribe(
        (res: any) => {
          this.acquireRight = new MatTableDataSource(res.acq_rights);
          this.acquireRight.sort = this.sort;
          let anyNegativeDelta: boolean = false;
          this.totalCostOfCostOptimization = 0;
          this.deltaCostOfCostOptimization = 0;
          for (const aqrRight of res.acq_rights) {
            // checking for any negative delta
            if (aqrRight.deltaCost < 0) anyNegativeDelta = true;
            if (aqrRight.costOptimization) {
              this.isCostOptimization = true;
              this.totalCostOfCostOptimization += aqrRight.totalCost;
              this.deltaCostOfCostOptimization += aqrRight.deltaCost;
            }
          }

          this.alertColor = anyNegativeDelta
            ? ALERT_COLOR.red
            : !!res.acq_rights.length
            ? ALERT_COLOR.green
            : '';

          if (this.acquireRight.filteredData.length > 0) {
            for (var i = 0; i < this.acquireRight.filteredData.length; i++) {
              this.acquireRight.filteredData[i].computedDetails =
                this.acquireRight.filteredData[i].computedDetails
                  .split(',')
                  .join(',\n');
            }
          }
          this.agg_name = res.aggregation_name;
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
      .getComputationDetails(this.swidTag, product.SKU)
      .subscribe(
        (res) => {
          this.computationDetails = new MatTableDataSource(
            res.computed_details
          );
          console.log(res);
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
}

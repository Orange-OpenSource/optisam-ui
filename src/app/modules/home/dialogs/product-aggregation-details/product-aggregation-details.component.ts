import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
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
  aggregationOptions: any;
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
    'numAcqLicences',
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
    numAcqLicences: 'Acquired Licenses',
    deltaNumber: 'Delta (licenses)',
    deltaCost: 'Delta',
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
  constructor(
    private productsService: ProductService,
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<ProductAggregationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loadingSubscription = this.sharedService.httpLoading().subscribe(load => {
      this._loading = load;
    });
  }

  ngOnInit() {
    this.getDetails();
    this.getOptionDetails();
    this.getAcquiredRights();
  }

  // Get aggregation details
  getDetails() {
    this._loading = true;
    this.productsService.getAggregationInfoDetails(this.data.aggregationID).subscribe(
      (res: any) => {
        this.productdetails = res;
        this.num_equipments = res.num_equipments;
        this._loading = false;
      },
      error => {
        this._loading = false;
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  // Get aggregation options
  getOptionDetails() {
    this._loading = true;
    this.productsService.getAggregationOptions(this.data.aggregationID).subscribe(
      (res: any) => {
        this.aggregationOptions = res;
        this._loading = false;
      },
      error => {
        this._loading = false;
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  get hasCompliance(): boolean {
    return this.acquireRight?.length !== 0;
  }
  
  // Get acquire rights
  getAcquiredRights() {
    this._loading = true;
    this.productsService.getAggregationAquiredRights(this.data.aggregationName).subscribe(
      (res: any) => {
        this.acquireRight = res.acq_rights;
        this.aggregationName = res.aggregationName;
        this._loading = false;
      },
      error => {
        this._loading = false;
        console.log('There was an error while retrieving Posts !!!' + error);
      });
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

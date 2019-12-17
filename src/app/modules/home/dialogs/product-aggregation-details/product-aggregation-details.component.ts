import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProductService } from 'src/app/core/services/product.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-product-aggregation-details',
  templateUrl: './product-aggregation-details.component.html',
  styleUrls: ['./product-aggregation-details.component.scss']
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

    // Get acquire rights
    this.productsService.getAggregationAquiredRights(this.data.aggregationName).subscribe(
      (res: any) => {
        this.acquireRight = res;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });

    // Get aggregation details
    this.productsService.getAggregationInfoDetails(this.data.aggregationName).subscribe(
      (res: any) => {
        this.productdetails = res;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });

    // Get aggregation options
    this.productsService.getAggregationOptions(this.data.aggregationName).subscribe(
      (res: any) => {
        this.aggregationOptions = res;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}

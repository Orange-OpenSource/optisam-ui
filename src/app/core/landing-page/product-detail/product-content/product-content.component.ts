import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ErrorResponse, ProductCatalogProduct } from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-content',
  templateUrl: './product-content.component.html',
  styleUrls: ['./product-content.component.scss'],
})
export class ProductContentComponent implements OnInit, OnChanges {
  _loading: boolean = false;
  @Input() product: any = null;
  @Input() separate: boolean = true;
  vendorsArray: any;
  supportVendors: string[];
  showAll = false;
  constructor(private productCatalogService: ProductCatalogService) {}

  ngOnInit(): void {
    // this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.product) {
      console.log(this.product);

      this.vendorsArray = this.product?.scopes?.slice(0, 3);
      this.supportVendors = this.product?.supportVendors?.filter(
        (item) => item !== ''
      );
    }
  }

  viewMore() {
    this.showAll = true;
  }

  // loadData(): void {
  //   this._loading = true;
  //   console.log('product content');
  //   this.$getProductByIdV2 = this.productCatalogService
  //     .getProductByIdV2(this.productId)
  //     .subscribe(
  //       (response: ProductCatalogProduct) => {
  //         this.product = response;
  //         this._loading = false;
  //         // this.versions = this.product?.version
  //         //   ?.map((v) => v.name)
  //         //   .join('  ,  ');
  //         // this.vr = this.product?.version
  //         //   ?.map((v) => v.recommendation)
  //         //   .join(',');
  //       },
  //       (error: ErrorResponse) => {
  //         console.log(error);
  //         // TODO ask how to show error
  //         this._loading = false;
  //         this.productId = '';
  //       }
  //     );
  // }

  onImgError(event): void {
    event.target.src = 'assets/images/default-company-icon.svg';
  }
}

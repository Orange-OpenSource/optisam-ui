import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ErrorResponse,
  ProductCatalogProduct,
  VersionHeader,
} from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnChanges, OnDestroy {
  @Input() productId: string = '';
  product: ProductCatalogProduct = null;
  _loading: boolean = false;
  versions: any;
  vr: any;
  versionHeaders: VersionHeader[] = [
    { key: 'name', header: 'Name', translation: 'PRODUCT.VERSION.NAME' },
    {
      key: 'swidTagVersion',
      header: 'SwidTag',
      translation: 'PRODUCT.VERSION.SWIDTAG',
    },
    {
      key: 'endOfLife',
      header: 'End Of Life',
      translation: 'PRODUCT.VERSION.EOL',
    },
    {
      key: 'endOfSupport',
      header: 'End Of Support',
      translation: 'PRODUCT.VERSION.EOS',
    },
  ];
  $getProductByIdV2: Subscription;

  constructor(private productCatalogService: ProductCatalogService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.productId) {
      this.loadData();
    }
  }

  loadData(): void {
    this._loading = true;
    this.$getProductByIdV2 = this.productCatalogService
      .getProductByIdV2(this.productId)
      .subscribe(
        (response: ProductCatalogProduct) => {
          this.product = response;
          this._loading = false;
          this.versions = this.product?.version
            ?.map((v) => v.name)
            .join('  ,  ');
          this.vr = this.product?.version
            ?.map((v) => v.recommendation)
            .join(',');
        },
        (error: ErrorResponse) => {
          console.log(error);
          // TODO ask how to show error
          this._loading = false;
          this.productId = '';
        }
      );
  }

  getVersion(): string {
    return this.product.version.map((v) => v.name).join(', ');
  }

  get getVersionTableHeader(): string[] {
    if (!this.product?.version?.length) return [];
    return Object.keys(this.product?.version[0]);
  }

  get versionTableHeaders(): string[] {
    return this.versionHeaders.map((ver: VersionHeader) => ver.key);
  }

  ngOnDestroy(): void {
    this.$getProductByIdV2?.unsubscribe();
  }
}

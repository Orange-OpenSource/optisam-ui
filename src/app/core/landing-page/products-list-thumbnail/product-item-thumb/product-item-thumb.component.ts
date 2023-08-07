import { TrimTextRangeInput } from './../../../modals/product-catalog.modal';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ProductCatalogProductSet, RecommendationTypes } from '@core/modals';

@Component({
  selector: 'app-product-item-thumb',
  templateUrl: './product-item-thumb.component.html',
  styleUrls: ['./product-item-thumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemThumbComponent implements OnInit, OnChanges {
  showScopeCount: number = 3;
  @Input('product') product: ProductCatalogProductSet = null;
  @Input('width') firstContainerWidth: number = 0;
  trimRangeHeader: TrimTextRangeInput = null;
  trimRangeInfo: TrimTextRangeInput = null;
  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.firstContainerWidth) {
      this.trimRangeHeader = {
        currentWidth: this.firstContainerWidth,
        min: { char: 29, minWidth: 300 },
        max: { char: 49, maxWidth: 454 },
      };
      this.trimRangeInfo = {
        currentWidth: this.firstContainerWidth,
        min: { char: 43, minWidth: 300 },
        max: { char: 67, maxWidth: 454 },
      };
    }
  }

  get isAuthorized(): boolean {
    return this.product?.recommendation === RecommendationTypes.authorized;
  }

  get isBlacklisted(): boolean {
    return this.product?.recommendation === RecommendationTypes.blackListed;
  }

  get isRecommended(): boolean {
    return this.product?.recommendation === RecommendationTypes.recommended;
  }

  backupImage(e): void {
    e.target.src = 'assets/images/default-company-icon.svg';
  }
}

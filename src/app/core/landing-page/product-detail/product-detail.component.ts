import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { HeaderInfoComponent } from './header-info/header-info.component';
import { ProductCatalogProductSet } from '@core/modals';
import { ProductCatalogService } from '@core/services';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit, OnChanges {
  @Input() separate: boolean = true;
  @Input('data') productDetail: ProductCatalogProductSet;
  productData: ProductCatalogProductSet;
  constructor(private productCatalogService: ProductCatalogService) { }

  ngOnInit(): void {
    this.productCatalogService.newTab.subscribe((tabData) => {
      this.productData = tabData.data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.productDetail) {
      this.productData = this.productDetail;
    }
  }
}

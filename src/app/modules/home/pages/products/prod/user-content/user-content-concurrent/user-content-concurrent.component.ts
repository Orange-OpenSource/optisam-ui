import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ProductType, TabMenu } from '@core/modals';
import { ProductService } from '@core/services';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-user-content-concurrent',
  templateUrl: './user-content-concurrent.component.html',
  styleUrls: ['./user-content-concurrent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserContentConcurrentComponent implements OnInit {
  @Input() productType: ProductType = ProductType.INDIVIDUAL;
  tabMenus: TabMenu[] = [
    {
      title: 'COMMON.TABS.INDIVIDUAL',
      link: '#',
      show: true,
    },

    {
      title: 'COMMON.TABS.AGGREGATION',
      link: '#',
      show: true,
    },
  ];
  activeTitle: string = this.tabMenus[0].title;
  productType$: Observable<ProductType>;
  constructor(private productService: ProductService) {}

  get productIndividual(): ProductType {
    return ProductType.INDIVIDUAL;
  }

  get productAggregation(): ProductType {
    return ProductType.AGGREGATION;
  }

  ngOnInit(): void {
    this.productType$ = this.productService
      .getUserCountDetailData()
      .pipe(pluck('productType'));
  }
}

import { UserCountDetailData } from './../../../../../../core/modals/product.modal';
import { SubSink } from 'subsink';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product, ProductType } from '@core/modals';
import { ProductService } from '@core/services';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit {
  subs: SubSink = new SubSink();
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: UserCountDetailData,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.productService.setUserCountDetailsData(this.data);
  }

  get individual(): ProductType {
    return ProductType.INDIVIDUAL;
  }

  get aggregation(): ProductType {
    return ProductType.AGGREGATION;
  }

  ngOnDestroy(): void {
    this.productService.setUserCountDetailsData(null);
  }
}

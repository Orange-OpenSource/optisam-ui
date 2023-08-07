import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Product, ProductType, TabMenu } from '@core/modals';
import { ProductService } from '@core/services';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-user-content-nominative',
  templateUrl: './user-content-nominative.component.html',
  styleUrls: ['./user-content-nominative.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserContentNominativeComponent implements OnInit {

  productType$!: Observable<ProductType>;
  
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

  constructor(private productService: ProductService) {}

  get individualProduct(): ProductType {
    return ProductType.INDIVIDUAL;
  }

  get aggregationProduct(): ProductType {
    return ProductType.AGGREGATION;
  }

  ngOnInit() {
    this.productType$ = this.productService.getUserCountDetailData().pipe(
      pluck('productType')
    )
  }
}

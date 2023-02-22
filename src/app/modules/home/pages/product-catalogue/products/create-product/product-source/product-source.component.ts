import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { ProductCatalogProduct } from '@core/modals';
import { CRUD } from '@core/util/constants/constants';

@Component({
  selector: 'app-product-source',
  templateUrl: './product-source.component.html',
  styleUrls: ['./product-source.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSourceComponent implements OnInit {
  @Input('data') data: ProductCatalogProduct = null;
  @Input('crud') crud: CRUD = CRUD.CREATE;
  openSourceGroup: FormGroup;
  closeSourceGroup: FormGroup;

  constructor(private container: ControlContainer) {}

  ngOnInit(): void {
    this.openSourceGroup = this.container?.control?.get(
      'productOpenSource'
    ) as FormGroup;
    this.closeSourceGroup = this.container?.control?.get(
      'productCloseSource'
    ) as FormGroup;
  }
}

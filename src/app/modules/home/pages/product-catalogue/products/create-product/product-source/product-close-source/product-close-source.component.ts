import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ControlContainer, FormArray, FormGroup } from '@angular/forms';
import { ProductCatalogProduct } from '@core/modals';
import { CRUD } from '@core/util/constants/constants';
import { CloseSourceListComponent } from './close-source-list/close-source-list.component';

@Component({
  selector: 'app-product-close-source',
  templateUrl: './product-close-source.component.html',
  styleUrls: ['./product-close-source.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCloseSourceComponent implements OnInit {
  @Input('data') data: ProductCatalogProduct = null;
  @Input('crud') crud: CRUD = CRUD.CREATE;
  closeSourceGroup: FormGroup;

  constructor(private container: ControlContainer) {}

  ngOnInit(): void {
    this.closeSourceGroup = this.container.control as FormGroup;
    console.log('crud', this.crud);
    console.log('data', this.data);
    if (this.crud != this.crudRead) this.addCloseSource();
    if (this.data) {
      this.data.closeSource.closeLicences.forEach((closeLicense: string) => {
        this.addCloseSource(closeLicense);
      });
    }
  }

  get crudRead(): CRUD {
    return CRUD.READ;
  }

  get closeLicenses(): FormArray {
    return this.closeSourceGroup?.get('closeLicenses') as FormArray;
  }

  addCloseSource(data: string = null): void {
    this.closeLicenses?.push(CloseSourceListComponent.addNewCloseSource(data));
  }

  removeProductCloseSource(index: number): void {
    this.closeLicenses.removeAt(index);
  }
}

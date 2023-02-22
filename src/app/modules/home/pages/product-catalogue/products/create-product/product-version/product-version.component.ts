import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from './dialogs/delete-confirmation/delete-confirmation.component';
import { CreateProductComponent } from '../create-product.component';
import { CRUD } from '@core/util/constants/constants';
import { ProductCatalogVersion } from '@core/modals';

@Component({
  selector: 'app-product-version',
  templateUrl: './product-version.component.html',
  styleUrls: ['./product-version.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVersionComponent implements OnInit {
  @Input('crud') crud: CRUD = CRUD.CREATE;
  @Input('index') index: number;
  @Output('removeVersion') remove: EventEmitter<number> = new EventEmitter();
  startDate: Date = new Date();
  form: FormGroup;

  constructor(private container: ControlContainer, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = (this.container?.control?.get('productVersions') as FormArray)
      ?.controls[this.index] as FormGroup;
  }

  get crudRead(): CRUD {
    return CRUD.READ;
  }

  get versionName(): FormControl {
    return this.form?.get('versionName') as FormControl;
  }
  get versionRecommendation(): FormControl {
    return this.form?.get('versionRecommendation') as FormControl;
  }
  get versionEOL(): FormControl {
    return this.form?.get('versionEOL') as FormControl;
  }
  get versionEOS(): FormControl {
    return this.form?.get('versionEOS') as FormControl;
  }

  static addNewVersion(data?: ProductCatalogVersion): FormGroup {
    const fb: FormBuilder = new FormBuilder();
    return fb.group({
      versionId: fb.control(data?.id || ''),
      versionName: fb.control(data?.name || '', [
        Validators.required,
        Validators.maxLength(200),
      ]),
      versionRecommendation: fb.control(data?.recommendation || '', [
        Validators.maxLength(200),
      ]),
      versionEOL: fb.control(
        data?.endOfLife ? new Date(data?.endOfLife).toISOString() : null,
        []
      ),
      versionEOS: fb.control(
        data?.endOfSupport ? new Date(data?.endOfSupport).toISOString() : null,
        []
      ),
      swidTag: fb.control(data?.swidTagVersion || null),
    });
  }

  removeVersion(): void {
    this.remove.emit(this.index);
  }

  confirmRemove(): void {
    let dialog = this.dialog.open(DeleteConfirmationComponent, {
      disableClose: true,
      height: '180px',
      width: '30%',
      minWidth: '250px',
      data: this.index,
    });

    dialog
      .afterClosed()
      .subscribe((res: boolean) => res && this.removeVersion());
  }
}

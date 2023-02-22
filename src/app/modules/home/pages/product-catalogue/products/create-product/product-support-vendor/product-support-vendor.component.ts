import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CRUD } from '@core/util/constants/constants';
import { DeleteConfirmationComponent } from '../product-version/dialogs/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-product-support-vendor',
  templateUrl: './product-support-vendor.component.html',
  styleUrls: ['./product-support-vendor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSupportVendorComponent implements OnInit {
  @Input('crud') crud: CRUD = CRUD.CREATE;
  @Input('index') index: number;
  @Output('removeSupportVendor') remove: EventEmitter<number> =
    new EventEmitter<number>();

  form: FormGroup;

  constructor(private container: ControlContainer, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = (
      this.container?.control?.get('productSupportVendor') as FormGroup
    )?.controls[this.index] as FormGroup;
  }

  static addNewSupportVendor(data?: string): FormGroup {
    const fb = new FormBuilder();
    return fb.group({
      supportVendorName: fb.control(data || '', [Validators.maxLength(200)]),
    });
  }

  get crudRead(): CRUD {
    return CRUD.READ;
  }

  get supportVendorName(): FormControl {
    return this.form?.get('supportVendorName') as FormControl;
  }

  removeSupportVendor(): void {
    this.remove.emit(this.index);
  }

  confirmRemove(): void {
    let dialog = this.dialog.open(DeleteConfirmationComponent, {
      height: '180px',
      minWidth: '200px',
      width: '30%',
      disableClose: true,
    });

    dialog
      .afterClosed()
      .subscribe((res: boolean) => res && this.removeSupportVendor());
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ControlContainer, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CRUD } from '@core/util/constants/constants';
import { DeleteConfirmationComponent } from '../product-version/dialogs/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-product-useful-links',
  templateUrl: './product-useful-links.component.html',
  styleUrls: ['./product-useful-links.component.scss'],
})
export class ProductUsefulLinksComponent implements OnInit {
  @Input('crud') crud: CRUD = CRUD.CREATE;
  @Input('index') index: number;
  @Output('removeLink') remove: EventEmitter<number> =
    new EventEmitter<number>();

  form: FormGroup;

  constructor(private container: ControlContainer, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = (this.container.control?.get('productUsefulLinks') as FormGroup)
      ?.controls[this.index] as FormGroup;
  }

  static addNewUsefulLink(data?: string): FormGroup {
    const fb = new FormBuilder();
    return fb.group({
      link: fb.control(data || ''),
    });
  }

  get crudRead(): CRUD {
    return CRUD.READ;
  }

  removeUsefulLink(): void {
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
      .subscribe((res: boolean) => res && this.removeUsefulLink());
  }
}

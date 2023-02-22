import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ControlContainer,
  FormArray,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CRUD } from '@core/util/constants/constants';
import { DeleteConfirmationComponent } from '../../../product-version/dialogs/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-close-source-list',
  templateUrl: './close-source-list.component.html',
  styleUrls: ['./close-source-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseSourceListComponent implements OnInit {
  @Input('crud') crud: CRUD = CRUD.CREATE;
  @Input('index') index: number;
  @Output('removeCloseSource') remove: EventEmitter<number> =
    new EventEmitter<number>();

  form: FormGroup;
  constructor(private container: ControlContainer, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = (
      (this.container.control as FormGroup)?.get('closeLicenses') as FormArray
    )?.controls[this.index] as FormGroup;
  }

  static addNewCloseSource(data?: any): FormGroup {
    const fb: FormBuilder = new FormBuilder();
    return fb.group({
      closeSourceName: fb.control(data || ''),
    });
  }

  get crudRead(): CRUD {
    return CRUD.READ;
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
      .subscribe((res: boolean) => res && this.remove.emit(this.index));
  }
}

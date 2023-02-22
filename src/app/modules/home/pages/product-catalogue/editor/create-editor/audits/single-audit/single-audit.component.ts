import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductCatalogAudit } from '@core/modals';
import { AuditDeletionConfirmationComponent } from './audit-deletion-confirmation/audit-deletion-confirmation.component';

@Component({
  selector: 'app-single-audit',
  templateUrl: './single-audit.component.html',
  styleUrls: ['./single-audit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleAuditComponent implements OnInit {
  audits: FormArray;
  form: FormGroup;
  yearList: number[];
  @Input() index: number;

  constructor(private dialog: MatDialog, private container: ControlContainer) {}

  ngOnInit(): void {
    this.audits = this.container.control as FormArray;
    this.form = this.audits?.controls[this.index] as FormGroup;
    this.setYearList();
  }

  static addNewAudit(data: ProductCatalogAudit = null): FormGroup {
    return new FormGroup({
      entity: new FormControl(data?.entity || '', [Validators.maxLength(200)]),
      date: new FormControl(
        data?.date ? new Date(data.date).getFullYear() : ''
      ),
    });
  }

  deleteAuditConfirmation() {
    this.dialog
      .open(AuditDeletionConfirmationComponent, {
        width: '300px',
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((status: boolean) => {
        if (status) this.audits.removeAt(this.index);
      });
  }

  get entity(): FormControl {
    return this.form?.get('entity') as FormControl;
  }

  setYearList(): void {
    const currentYear: number = new Date().getFullYear();
    const yearList: number[] = [];
    for (let y = currentYear; y >= currentYear - 50; y--) {
      yearList.push(y);
    }
    this.yearList = yearList;
  }
}

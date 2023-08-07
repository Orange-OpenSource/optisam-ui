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
import { PartnerDeletionConfirmationComponent } from './partner-deletion-confirmation/partner-deletion-confirmation.component';
import { NameEmail } from '@core/modals';

@Component({
  selector: 'app-single-partner-manager',
  templateUrl: './single-partner-manager.component.html',
  styleUrls: ['./single-partner-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePartnerManagerComponent implements OnInit {
  @Input('index') index: number;
  form: FormGroup;
  partnerManagers: FormArray;
  constructor(private container: ControlContainer, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.partnerManagers = this.container.control as FormArray;
    this.form = this.partnerManagers?.controls[this.index] as FormGroup;
  }

  static addPartnerManager(data: NameEmail = null): FormGroup {
    return new FormGroup({
      name: new FormControl(data?.name || '', Validators.maxLength(200)),
      email: new FormControl(data?.email || '', Validators.email),
    });
  }

  get name(): FormControl {
    return this.form?.get('name') as FormControl;
  }

  get email(): FormControl {
    return this.form?.get('email') as FormControl;
  }

  deleteConfirmation() {
    this.dialog
      .open(PartnerDeletionConfirmationComponent, {
        width: '300px',
        disableClose: true,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((status: boolean) => {
        if (status) {
          this.partnerManagers.removeAt(this.index);
        }
      });
  }
}

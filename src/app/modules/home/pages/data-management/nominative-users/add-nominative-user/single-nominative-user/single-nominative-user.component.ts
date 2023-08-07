import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomValidators } from '@core/custom-validators';
import { NominativeUserDetails } from '@core/modals';
import { DataManagementService } from '@core/services/data-management.service';
import { TranslateService } from '@ngx-translate/core';
import { SimpleConfirmationComponent } from '@shared/dialog/simple-confirmation/simple-confirmation.component';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-single-nominative-user',
  templateUrl: './single-nominative-user.component.html',
  styleUrls: ['./single-nominative-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleNominativeUserComponent implements OnInit, OnDestroy {
  @Input() index: number;
  @Output() onRemove: EventEmitter<number> = new EventEmitter<number>();
  form: FormGroup;
  subs: SubSink = new SubSink();

  // Getters --- start ---------------------------------
  get email(): FormControl {
    return this.form?.get('email') as FormControl;
  }

  get profile(): FormControl {
    return this.form?.get('profile') as FormControl;
  }

  get emptyText(): string {
    return this.translate.instant('EMPTY');
  }
  // Getters --- end ---------------------------------

  constructor(
    private container: ControlContainer,
    private dataManagement: DataManagementService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) { }

  static addNominativeUserGroup(data?: NominativeUserDetails): FormGroup {
    const disabled = data !== null && !data?.fileInsertion;
    const nominativeUserGroup: FormGroup = new FormGroup({
      username: new FormControl(data?.user_name || '', []),
      firstName: new FormControl(data?.first_name || '', []),
      email: new FormControl(
        { value: data?.email || '', disabled: data !== null },
        [Validators.required, Validators.email, CustomValidators.uniqueNominativeUsersEmail()]
      ),
      profile: new FormControl(data?.profile || '', [CustomValidators.uniqueNominativeUsersProfile()]),
      activationDate: new FormControl(data?.activation_date || null, []),
    });
    if (data) nominativeUserGroup.markAsDirty();
    return nominativeUserGroup;
  }

  ngOnInit(): void {
    this.form = (this.container?.control as FormArray)?.controls[
      this.index
    ] as FormGroup;

    this.subs.add(
      this.dataManagement.isUserDetailsUpdated().subscribe((res: boolean) => {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();
      })
    );
  }

  get visibleClose(): boolean {
    return (
      Object.keys(this.form?.value || {}).length ===
      Object.keys(this.form?.getRawValue() || {}).length
    );
  }

  deleteUser(): void {
    if (this.form.pristine) {
      this.dataManagement.triggerRemoveUser(this.index);
      return;
    }

    this.dialog
      .open(SimpleConfirmationComponent, {
        disableClose: true,
        minWidth: '300px',
        width: '40vw',
      })
      .afterClosed()
      .subscribe((confirm: boolean) => {
        if (confirm) this.dataManagement.triggerRemoveUser(this.index);
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

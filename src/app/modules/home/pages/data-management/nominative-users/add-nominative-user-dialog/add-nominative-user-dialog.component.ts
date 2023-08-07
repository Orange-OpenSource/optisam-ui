import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NominativeUserList, ProductType } from '@core/modals';
import { AddNominativeUserComponent } from '../add-nominative-user/add-nominative-user.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-add-nominative-user-dialog',
  templateUrl: './add-nominative-user-dialog.component.html',
  styleUrls: ['./add-nominative-user-dialog.component.scss'],
})
export class AddNominativeUserDialogComponent
  implements OnInit, AfterViewChecked
{
  @ViewChild(AddNominativeUserComponent)
  nominativeUserComponent: AddNominativeUserComponent;
  @ViewChild('actionButton') actionButton: MatButton;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { editData: NominativeUserList; activeTitle: ProductType },
    private dialogRef: MatDialogRef<AddNominativeUserDialogComponent>,
    private cd: ChangeDetectorRef
  ) {}

  // getter start ---------------------------------------------------------------------
  get isCreate(): boolean {
    return !this.data.editData;
  }
  // getter end -----------------------------------------------------------------------

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  addNominativeUser(): void {
    this.nominativeUserComponent.onSubmit();
  }

  isSuccess(success: boolean): void {
    if (success) this.dialogRef.close(success);
  }

  get inValid(): boolean {
    return (
      !!this.nominativeUserComponent?.nominativeUserForm?.invalid ||
      this.nominativeUserComponent?.nominativeUserForm?.pristine
    );
  }
}

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConcurrentUserList } from '@core/modals';
import { AddConcurrentUsersComponent } from '../add-concurrent-users/add-concurrent-users.component';

@Component({
  selector: 'app-add-concurrent-users-dialog',
  templateUrl: './add-concurrent-users-dialog.component.html',
  styleUrls: ['./add-concurrent-users-dialog.component.scss'],
})
export class AddConcurrentUsersDialogComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(AddConcurrentUsersComponent)
  addConcurrentUsers: AddConcurrentUsersComponent;
  // inValid: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { activeTitle: string; editData: ConcurrentUserList },
    private dialogRef: MatDialogRef<AddConcurrentUsersDialogComponent>,
    private cd: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  // getter start ---------------------------------------------------------------------
  get isCreate(): boolean {
    return !this.data?.editData;
  }
  // getter end -----------------------------------------------------------------------

  ngOnInit(): void {
    console.log('edit', this.data);
  }

  addConcurrentUser(): void {
    this.addConcurrentUsers.onSubmit();
  }

  isSuccess(success: boolean): void {
    if (success) this.dialogRef.close(success);
  }
  get inValid(): boolean {
    return (
      !!this.addConcurrentUsers?.concurrentUserForm?.invalid ||
      this.addConcurrentUsers?.concurrentUserForm?.pristine
    );
  }
}

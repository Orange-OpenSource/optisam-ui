import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { CoreFactorService } from '@core/services/core-factor.service';
import { TranslateService } from '@ngx-translate/core';
import { SuccessMessageComponent } from './success-message/success-message.component';

@Component({
  selector: 'app-core-factor-upload',
  templateUrl: './core-factor-upload.component.html',
  styleUrls: ['./core-factor-upload.component.scss'],
})
export class CoreFactorUploadComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  selectedFile: File;
  showActivityLogs$: Observable<boolean>;
  submitSub: Subscription;
  allowedInventoryFiles: string[] = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  errorMsg: string = '';
  activityLogError$: Observable<string>;
  activityLogVisibility$: Observable<boolean>;
  uploading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CoreFactorUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef,
    private coreFactorService: CoreFactorService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log(this.data)
    this.activityLogError$ = this.coreFactorService.getActivityLogError();
    this.activityLogVisibility$ =
      this.coreFactorService.getActivityLogVisibility();
  }

  onBrowseClickHandler(): void {
    this.resetHandler();
    this.fileInput.nativeElement.click();
  }

  onFileChangeHandler(): void {
    this.selectedFile = this.fileInput.nativeElement.files[0];
    if (!this.allowedInventoryFiles.includes(this.selectedFile.type)) {
      this.resetHandler();
      this.translateService
        .stream('INVALID_FILE_TYPE')
        .subscribe((trans: string) => {
          this.errorMsg = trans;
        });
    }
  }

  resetHandler(): void {
    this.fileInput.nativeElement.value = '';
    this.selectedFile = null;
    this.errorMsg = '';
    if (this.submitSub) this.submitSub.unsubscribe();
  }

  submitHandler(): void {
    this.uploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.submitSub = this.coreFactorService.uploadFile(formData).subscribe(
      (res) => {
        this.uploading = false;
        this.successMessage(res);
      },
      (error) => {
        this.uploading = false;
        this.resetHandler();
        this.errorMsg = error;
      },
      () => {
        this.uploading = false;
      }
    );
  }

  cancelHandler(): void {
    this.resetHandler();
    this.dialogRef.close();
  }

  successMessage(res: any): void {
    let dialogRef = this.dialog.open(SuccessMessageComponent, {
      minHeight: '150px',
      height: '150px',
      maxHeight: '70vh',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.cancelHandler();
    });
  }

  ngOnDestroy(): void {
    this.coreFactorService.setActivityLogError('');
    this.coreFactorService.setActivityLogVisibility(true);
  }
}

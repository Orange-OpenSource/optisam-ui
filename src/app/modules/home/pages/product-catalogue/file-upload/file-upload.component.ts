import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductCatalogService } from '@core/services';
import { CoreFactorService } from '@core/services/core-factor.service';
import { SuccessMessageComponent } from '@home/pages/core-factor-management/core-factor-upload/success-message/success-message.component';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { SuccessFileUploadComponent } from './success-file-upload/success-file-upload.component';
import { bytesToMB } from '@core/util/common.functions';

const MAX_ALLOWED_FILE_SIZE: number = 13;

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  selectedFile: any;
  errorMsg: string;
  submitSub: Subscription;
  showActivityLogs$: Observable<boolean>;
  activityLogError$: Observable<string>;
  activityLogVisibility$: Observable<boolean>;
  allowedInventoryFiles: string[] = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  uploading: boolean;
  constructor(
    private coreFactorService: CoreFactorService,
    private productCatalog: ProductCatalogService,
    public dialogRef: MatDialogRef<FileUploadComponent>,
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.activityLogError$ = this.productCatalog.getActivityLogError();
    this.activityLogVisibility$ =
      this.productCatalog.getActivityLogVisibility();
  }

  onBrowseClickHandler(): void {
    this.resetHandler();
    this.fileInput.nativeElement.click();
  }

  onFileChangeHandler(): void {
    this.selectedFile = this.fileInput.nativeElement.files[0];
    if (!this.isValidFileSize) return;

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
    console.log(formData);
    this.submitSub = this.productCatalog.uploadFile(formData).subscribe(
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
    let dialogRef = this.dialog.open(SuccessFileUploadComponent, {
      minHeight: '150px',
      height: '150px',
      maxHeight: '70vh',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.cancelHandler();
    });
  }

  get isValidFileSize(): boolean {
    const isValid: boolean =
      bytesToMB(this.selectedFile?.size || 0) <= MAX_ALLOWED_FILE_SIZE;
    if (!isValid)
      this.errorMsg = `File size exceeding the limit of ${MAX_ALLOWED_FILE_SIZE} MB`;
    return isValid;
  }

  ngOnDestroy(): void {
    this.coreFactorService.setActivityLogError('');
    this.coreFactorService.setActivityLogVisibility(true);
  }
}

import { CommonService } from '@core/services/common.service';
import { LOCAL_KEYS, UPLOAD_TYPES } from '@core/util/constants/constants';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { NominativeUserType, ProductType } from '@core/modals';
import { DataManagementService } from '@core/services/data-management.service';
import { Subscription } from 'rxjs';

interface ProductFormType {
  productEditor: string;
  productName: string;
  productVersion: string;
  userDetails: any[];
}

interface AggregationFormType {
  aggregationName: number;
  userDetails: any[];
}

@Component({
  selector: 'app-browse-file-upload',
  templateUrl: './browse-file-upload.component.html',
  styleUrls: ['./browse-file-upload.component.scss'],
})
export class BrowseFileUploadComponent implements OnInit, AfterViewInit {
  @ViewChild('hiddenInput') fileInput: ElementRef<HTMLInputElement>;
  uploadedPercent: number = 40;
  progressPercent: number = 0;
  selectedFile: File = null;
  fileUploading$: Subscription;
  processing: boolean = false;
  errorMessage: string = null;
  constructor(
    private dialogRef: MatDialogRef<BrowseFileUploadComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      formData: { product?: ProductFormType; aggregation: AggregationFormType };
      type: NominativeUserType;
    },
    private cs: CommonService,
    private dm: DataManagementService
  ) {}

  ngOnInit(): void {
    console.log('data', this.data);
  }
  ngAfterViewInit(): void {}

  triggerClick(): void {
    this.fileInput.nativeElement.click();
  }

  fileInserted(fileList: FileList): void {
    if (!fileList) return;
    const file: File = fileList[0];
    this.selectedFile = file;
    this.fileInput.nativeElement.value = '';
    this.errorMessage = null;
  }

  uploadFile(): void {
    if (this.processing) return;
    this.processing = true;
    const formData: FormData = new FormData();
    const dataGroup = this.data?.formData?.[this.data?.type || ''] || null;
    formData.append('file', this.selectedFile);
    formData.append('scope', this.cs.getLocalData(LOCAL_KEYS.SCOPE));
    if (this.data.type === NominativeUserType.product) {
      formData.append('editor', dataGroup?.productEditor);
      formData.append('product_name', dataGroup?.productName);
      formData.append('product_version', dataGroup?.productVersion);
    }

    if (this.data.type === NominativeUserType.aggregation) {
      dataGroup?.aggregationName &&
        formData.append('aggregation_id', String(dataGroup?.aggregationName));
    }
    this.fileUploading$ = this.dm.uploadNominativeUserData(formData).subscribe(
      (res: any) => {
        if (res?.status && res?.status === 'progress') {
          this.progressPercent = res.message;
        } else if (res?.status && res?.status === 'sent') {
          // this.progressPercent = 0;
        } else {
          this.gotResponse(res);
        }
      },
      (e) => {
        this.processing = false;
        this.errorMessage ||= 'UNKNOWN_ERROR';
      }
    );
  }

  private gotResponse(res: any): void {
    if (res === true) {
      this.processing = false;
      this.errorMessage = '';
      this.dialogRef.close(true);
      return;
    }

    if (res?.status === 'DEFAULT') {
      this.errorMessage = res?.description || '';
    }
  }

  reset(): void {
    this.fileInput.nativeElement.value = '';
    this.selectedFile = null;
    this.fileUploading$?.unsubscribe();
    this.processing = false;
    this.progressPercent = 0;
    this.errorMessage = null;
  }

  cancelAll(): void {
    this.fileUploading$?.unsubscribe();
    this.dialogRef.close();
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataManagementService } from 'src/app/core/services/data-management.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../dialogs/product-details/details';
import {
  FILE_ANALYSIS_STATUS,
  UPLOAD_TYPES,
  REPORT_FILE_NAME,
} from '@core/util/constants/constants';

function fileErrorCheck(control: AbstractControl): ValidationErrors | null {
  return this.fileValidationError
    ? {
        fileError: `There are some error in the given ${
          control?.value && control.value.length > 1 ? 'files' : 'file'
        }`,
      }
    : null;
}

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss'],
})
export class UploadDataComponent implements OnInit {
  uploadForm: FormGroup;
  filename: String;
  showFileErrorMessage: Boolean = false;
  loading: Boolean = false;
  activeTab: any;
  selectedFiles: File[] = [];
  errorMsg: string;
  selectedScope: any;
  allowedInventoryFiles: string[] = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
  ];
  fileError: string = '';
  fileValidationError: boolean = false;
  fileAnalyzingScopes: string[] = ['GENERIC'];
  currentScopeType = localStorage.getItem('scopeType');
  analysisProgress: number = 0;
  showAnalysisBar: boolean = false;
  analysisFileUrl: string = '';
  analysisDescription: string = '';
  targetFileName: string = '';
  uploadDataManagementFilesNew$: Subscription;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private dataService: DataManagementService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.activeTab = this.data;
    this.selectedScope = localStorage.getItem('scope');
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      file: this.fb.control(null, [Validators.required]),
      ...(this.activeTab == 'Globaldata' && {
        isDeleteOldInventory: this.fb.control(false),
      }),
    });
  }

  get file() {
    return this.uploadForm.get('file');
  }
  get isDeleteOldInventory() {
    return this.uploadForm.get('isDeleteOldInventory');
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true,
    });
  }

  process(successMsg, errorMsg, duplicateMsg, invalidFileNameMsg) {
    this.uploadForm.markAsPristine();
    this.loading = true;
    const formData = new FormData();
    formData.append('scope', this.selectedScope);

    if (this.currentScopeType !== 'GENERIC') {
      for (let i = 1; i <= this.file.value.length; i++) {
        formData.append('file', this.file.value[i - 1]);
      }
    }

    if (this.targetFileName) formData.append('file', this.targetFileName);

    if (this.activeTab === 'Globaldata') {
      //On successful inventory deletion, we're calling the upload
      // formData.append('scopeType', localStorage.getItem('scopeType'));
      if (this.isDeleteOldInventory.value) {
        this.dataService.deleteInventory().subscribe(
          (res) => {
            formData.append('isDeleteOldInventory', 'false'); //this.isDeleteOldInventory.value)//TODO
            this.uploadFile(
              formData,
              successMsg,
              errorMsg,
              duplicateMsg,
              invalidFileNameMsg
            );
          },
          (err) => {
            this.errorMsg =
              err.error.message ||
              'Some error occured! Could not complete delete operation.';
            this.openModal(errorMsg);
            this.loading = false;
          }
        );
      } else {
        formData.append('isDeleteOldInventory', 'false'); //this.isDeleteOldInventory.value)//TODO
        this.uploadFile(
          formData,
          successMsg,
          errorMsg,
          duplicateMsg,
          invalidFileNameMsg
        );
      }
    } else {
      // For 'Data' & 'Metadata' upload
      this.uploadFile(
        formData,
        successMsg,
        errorMsg,
        duplicateMsg,
        invalidFileNameMsg
      );
    }
  }

  uploadFile(formData, successMsg, errorMsg, duplicateMsg, invalidFileNameMsg) {
    this.dataService
      .uploadDataManagementFiles(formData, this.activeTab.toLowerCase())
      .subscribe(
        (data) => {
          this.loading = false;
          this.openModal(successMsg);
        },
        (err) => {
          this.loading = false;
          if (err.message == 'Scope already exists') {
            this.openModal(duplicateMsg);
          } else if (err.error.trim() == 'cannot upload Error') {
            this.openModal(invalidFileNameMsg);
          } else {
            if (err.error.trim() == 'FileExtensionValidationFailure') {
              this.errorMsg =
                'Invalid file extension. Please upload a .csv or .xlsx file.';
            } else if (err.error.trim() == 'Injection is already running') {
              this.errorMsg = 'Injection is already running';
            } else if (err.error.trim() == 'Deletion is already running') {
              this.errorMsg = 'Deletion is already running';
            } else {
              this.errorMsg =
                err.error.message || 'File(s) could not be uploaded.';
            }
            this.openModal(errorMsg);
          }
        }
      );
  }

  onFileSelect(event): void {
    this.selectedFiles = [];

    if (event.target.files.length) {
      for (let file of event.target.files) {
        if (this.fileInvalid(file)) return;
        this.selectedFiles.push(file);
      }
      this.file.setValue(this.selectedFiles);

      if (this.fileAnalyzingScopes.includes(this.currentScopeType)) {
        // analyzing data file
        this.analyzeFile();
      } else {
        // without analyzing
        this.fileValidationError = false;
      }
    }
  }

  resetForm() {
    this.uploadForm.reset();
    this.selectedFiles = [];
    this.clearFileInput(document.getElementById('file'));
    this.cancelInjectionData();
  }

  //Analysing inventroy data file upload
  analyzeFile(): void {
    this.resetVariables();
    this.showAnalysisBar = true;
    const formData = new FormData();
    formData.append('file', this.selectedFiles[0]);
    formData.append('scope', this.selectedScope);
    formData.append('uploadType', UPLOAD_TYPES.ANALYSIS);

    // send formData to uploadDataManagementFilesNew method of the data-management.service.ts
    this.uploadDataManagementFilesNew$ = this.dataService
      .uploadDataManagementFilesNew(formData)
      .subscribe(
        (data) => {
          if (data?.status && data?.status === 'progress') {
            this.analysisProgress = data.message;
          } else {
            this.onGettingResponse(data);
          }
        },
        (error) => {
          this.showAnalysisBar = false;
          this.analysisDescription = error.statusText;
        }
      );
  }

  onGettingResponse(data): void {
    this.targetFileName = '';
    this.analysisDescription = '';
    this.showAnalysisBar = true;
    switch (data.status) {
      case FILE_ANALYSIS_STATUS.completed:
        this.analysisFileUrl = data.report;
        this.analysisDescription = data.description;
        this.targetFileName = data.targetFile;
        if (this.targetFileName) {
          const url = new URL('http://localhost/' + this.targetFileName);
          this.targetFileName = url.searchParams.get('fileName');
        }
        this.showAnalysisBar = false;
        this.fileValidationError = false;
        break;

      case FILE_ANALYSIS_STATUS.failed:
        this.analysisDescription = data.description;
        this.showAnalysisBar = false;
        break;

      case FILE_ANALYSIS_STATUS.partial:
        this.analysisDescription = data.description;
        this.showAnalysisBar = false;
        break;

      case 'DEFAULT':
        break;

      default:
        this.analysisDescription = data.description;
        this.showAnalysisBar = false;
        break;
    }
  }

  resetVariables(): void {
    this.fileValidationError = true;
    this.showAnalysisBar = false;
    this.analysisFileUrl = '';
    this.analysisDescription = '';
    this.analysisProgress = 0;
  }

  // download analysis file
  downloadAnalysisFile(): void {
    if (!this.analysisFileUrl) return;
    this.dataService
      .downloadAnalysisFile(this.analysisFileUrl)
      .subscribe((blob) => {
        const url = URL.createObjectURL(blob);
        const fileName = REPORT_FILE_NAME;
        const dwldLink: any = document.createElement('a');
        dwldLink.setAttribute('href', url);
        dwldLink.setAttribute('download', fileName);
        dwldLink.style.visibility = 'hidden';
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      });
  }

  // Reset selected file
  clearFileInput(ctrl: any) {
    if (ctrl) {
      ctrl.value = null;
    }
  }
  resetUpload(e: Event): void {
    (e.target as HTMLInputElement).value = null;
    this.resetForm();
  }

  backToList() {
    if (this.activeTab == 'Data') {
      this.router.navigate(['/optisam/dm/data']);
    } else if (this.activeTab == 'Metadata') {
      this.router.navigate(['/optisam/dm/metadata']);
    } else {
      this.router.navigate(['/optisam/dm/globaldata']);
    }
  }

  fileInvalid(file: File): boolean {
    this.fileError = '';
    if (!this.allowedInventoryFiles.includes(file.type)) {
      this.fileError = 'Invalid file type!';
      return true;
    }
    return false;
  }

  get submitValidate(): Boolean {
    return (
      this.uploadForm.invalid ||
      (this.uploadForm.pristine &&
        (this.loading || !this.selectedFiles.length)) ||
      this.fileValidationError
    );
  }

  cancelInjectionData(): void {
    if (this.uploadDataManagementFilesNew$)
      this.uploadDataManagementFilesNew$.unsubscribe();
    this.showAnalysisBar = false;
    this.analysisDescription = '';
    this.analysisFileUrl = '';
  }

  ngOnDestroy() {
    this.dialog.closeAll();
    this.cancelInjectionData();
  }
}

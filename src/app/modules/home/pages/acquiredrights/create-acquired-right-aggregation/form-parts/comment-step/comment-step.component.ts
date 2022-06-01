import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-comment-step',
  templateUrl: './comment-step.component.html',
  styleUrls: ['./comment-step.component.scss'],
})
export class CommentStepComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  selectedFile: File;
  errorMsg: any;
  showActivityLogs$: Observable<boolean>;
  submitSub: Subscription;
  currentSelectedFile: string;
  invalidFileType: Boolean;
  allowedInventoryFiles: string[] = [
    // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // 'application/vnd.ms-excel',
    'application/pdf',
  ];
  commentForm: FormGroup;
  checkFile: boolean;
  constructor(private fb: FormBuilder,
    private translateService: TranslateService,
    ) {}

  ngOnInit(): void {
    this.formInit();
   this.checkFile= true;
  }

  formInit(): void {
    this.commentForm = this.fb.group({
      comment: this.fb.control(''),
      file_name: this.fb.control(''),
      file_data: this.fb.control(''),
    });
  }
  handleUpload(file)
   {
      const reader = new FileReader(); reader.readAsDataURL(file); reader.onload =
       () => { this.currentSelectedFile = reader.result.toString().split(",")[1];
       console.log(this.currentSelectedFile);

       this.commentForm.patchValue({file_data: this.currentSelectedFile});
       console.log("Create fileData",this.currentSelectedFile);
      
      };
      
     }
  
  
  

  getBase64(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); 
    reader.readAsDataURL(file); reader.onload = () => resolve(reader.result); reader.onerror = error => reject(error); }); }

  
    resetInput()
    {
      this.checkFile = false;
      // this.updateFile = false;
      this.fileInput.nativeElement.value = '';
  
    }

  resetHandler(): void {
    this.fileInput.nativeElement.value = '';
    this.selectedFile = null;
    this.errorMsg = '';
    if (this.submitSub) this.submitSub.unsubscribe();
  }

  onBrowseClickHandler(): void {
    this.resetHandler();
    this.fileInput.nativeElement.click();
  }

  deleteSelectedFile()
  {
    this.selectedFile = null;
    console.log("Inside deleteSelected");
  }

  onFileChangeHandler(): void {
    this.selectedFile = this.fileInput.nativeElement.files[0];
    

     console.log("filehandler");
     this.commentForm.patchValue({file_name:this.selectedFile.name});
    console.log("file_name",this.commentForm.get('file_name').value);
    this.handleUpload(this.selectedFile);

    if (!this.allowedInventoryFiles.includes(this.selectedFile.type)) {
      this.resetHandler();
      this.translateService
        .stream('INVALID_FILE_TYPE')
        .subscribe((trans: string) => {
          this.errorMsg = trans;
          this.commentForm.patchValue({file_data:''});
          this.commentForm.patchValue({file_name:''});    
        });
    }
    
    this.commentForm.markAsDirty();
  }
}

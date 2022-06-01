import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Aggregation } from '@core/modals';
import { ProductService } from '@core/services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-comment-step',
  templateUrl: './edit-comment-step.component.html',
  styleUrls: ['./edit-comment-step.component.scss'],
})
export class EditCommentStepComponent implements OnInit {
  commentForm: FormGroup;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  selectedFile: File;
  submitSub: Subscription;
  errorMsg: any;
  checkFile: boolean;
  updateFile: boolean;
  fileName: any;
  currentSelectedFile: string;
  allowedInventoryFiles: string[] = [
    // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // 'application/vnd.ms-excel',
    'application/pdf',
  ];
  data: Aggregation;

  constructor(
    private fb: FormBuilder,
    private translateService: TranslateService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.formInit();
    console.log("test");
    this.productService.getAggregationData().subscribe((data: Aggregation) => {
      this.data = data;
      console.log("Data:",this.data);
      this.commentForm.patchValue({ comment: this.data.comment });
      this.commentForm.patchValue({file_name: this.data.file_name});
      console.log("Old fileName", this.data.file_name);
      this.commentForm.patchValue({file_data: this.data.file_data});
      console.log("Old data", this.data.file_data);
      if(this.data.file_name)
      {
        this.checkFile = true;
      }
      if(this.fileName)
      {
        this.updateFile = true;
      }
      
    });

    console.log()
  }

  formInit(): void {
    this.commentForm = this.fb.group({
      comment: this.fb.control(''),
      file_name: this.fb.control(''),
      file_data: this.fb.control(''),
    });
  }

  get comment() {
    return this.commentForm.get('comment');
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

   
  handleUpload(file)
   {
      const reader = new FileReader(); reader.readAsDataURL(file); reader.onload =
       () => { this.currentSelectedFile = reader.result.toString().split(",")[1];
       console.log(this.currentSelectedFile);
       this.commentForm.patchValue({file_data: this.currentSelectedFile});
       this.fileName = this.selectedFile.name;
       this.commentForm.patchValue({file_name: this.fileName});

       console.log(this.commentForm.value);
      };
      
     }
  
  resetInput()
  {
    // this.checkFile = false;
    this.updateFile = false;
    this.fileInput.nativeElement.value = '';

  }

  deleteSelectedFile()
  {
    this.data.file_name = null;
    this.commentForm.patchValue({ file_name:'' });
    this.commentForm.patchValue({file_data:''});
    this.checkFile = false;
    this.commentForm.markAsDirty();
    
    // const formData = new FormData();
  
  }

  deleteUpdatedFile()
  {
    this.fileName = null;
    this.commentForm.patchValue({ file_name:'' });
    this.commentForm.patchValue({file_data:''});
    this.updateFile = false;
 
    this.commentForm.markAsDirty();
   
  }
  onFileChangeHandler(): void {
    this.selectedFile = this.fileInput.nativeElement.files[0];
  
    if(!this.allowedInventoryFiles.includes(this.selectedFile.type)){
      return ;
    }
    this.handleUpload(this.selectedFile);
  
    if (!this.allowedInventoryFiles.includes(this.selectedFile.type)) {
      this.resetHandler();
      this.translateService
        .stream('INVALID_FILE_TYPE')
        .subscribe((trans: string) => {
          this.errorMsg = trans;
        });
    }

    this.commentForm.markAsDirty();
     
      this.checkFile = false;
      this.updateFile = true;
    
  }
  downloadAggregationFile(sku,filename)
  {
 
    // const filePath = file.error_file_api.slice(8);
    this.productService.getAggregationDownloadFile(sku).subscribe(
      (res) => {

        console.log(res.file_data);

        const url = `data:application/pdf;base64,${res.file_data}`;

        const downloadEl = document.createElement('a');

        downloadEl.href = url;
        downloadEl.download = filename;
        downloadEl.click();
      },
      // (error) => {
      //   this.errorMsg =
      //     error.error.message ||
      //     'Some error occured! Could not download records for selected global file';
      //   this.openModal(errorMsg);
      //   console.log('Some error occured! Could not download file.', error);
      // }
    );
  }

}

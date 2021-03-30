// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataManagementService } from 'src/app/core/services/data-management.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../dialogs/product-details/details';
import { GroupService } from 'src/app/core/services/group.service';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent implements OnInit {

  uploadForm: FormGroup;
  filename: String;
  showFileErrorMessage: Boolean = false;
  loading: Boolean = false;
  activeTab: any;
  scopesList: any[]=[];
  selectedFiles: any[]=[];
  errorMsg:string;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private groupService: GroupService,
    private dataService: DataManagementService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { 
    this.activeTab = this.data;
    this.getScopesList();
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({});
    this.uploadForm.addControl('scope', new FormControl('',[Validators.required]))
    this.uploadForm.addControl('file', new FormControl('',[Validators.required]));
    if(this.activeTab=='Globaldata') {
      this.uploadForm.addControl('isDeleteOldInventory', new FormControl(false));      
    }
  }

  get scope() {
    return this.uploadForm.get('scope');
  }
  get file() {
    return this.uploadForm.get('file');
  }
  get isDeleteOldInventory() {
    return this.uploadForm.get('isDeleteOldInventory');
  }

  getScopesList() {
    this.groupService.getDirectGroups().subscribe((response: any) => {
      response.groups.map(res=>{ res.scopes.map(s=>{this.scopesList.push(s);});});
    }, (error) => {
      console.log("Error fetching groups");
    });
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '30%',
        disableClose: true
    });
  }

  uploadFile(successMsg, errorMsg, duplicateMsg, invalidFileNameMsg) {
    this.uploadForm.markAsPristine();
    this.loading = true;
    const formData = new FormData();
    formData.append('scope', this.scope.value);
    for(let i = 1; i <= this.file.value.length; i++) {
      formData.append('file1', this.file.value[i-1]);
    }
    if(this.activeTab === 'Globaldata') {
      formData.append('isDeleteOldInventory',this.isDeleteOldInventory.value)
    }
    this.dataService.uploadDataManagementFiles(formData, this.activeTab.toLowerCase()).subscribe(data => {
      this.loading = false;
      this.openModal(successMsg);
    }, err => {
      this.loading = false;
      if(err.message == 'Scope already exists')
      {
        this.openModal(duplicateMsg);
      }
      else if(err.error.trim() == 'cannot upload Error') {
        this.openModal(invalidFileNameMsg);
      }
      else {
        if(err.error.trim() == 'FileExtensionValidationFailure') {
          this.errorMsg = 'Invalid file extension. Please upload a .csv or .xlsx file.'
        }
        else {
          this.errorMsg = err.error.message||'File(s) could not be uploaded.';
        }
        this.openModal(errorMsg);
      }
    });
  }

  onFileSelect(event) {
    this.selectedFiles = [];
    if (event.target.files.length > 0) {
      for(let i=0; i<event.target.files.length;i++){
        this.selectedFiles.push(event.target.files[i]);
      }
      this.file.setValue(this.selectedFiles);
    }
  }

  resetForm() {
    this.uploadForm.reset();
    this.selectedFiles = [];
    this.clearFileInput(document.getElementById("file"));
  }

  // Reset selected file
  clearFileInput(ctrl:any) {
    if (ctrl) {
        ctrl.value = null;
    }
  }

  backToList() {
    if(this.activeTab=='Data') {
      this.router.navigate(['/optisam/dm/data']);
    }
    else if(this.activeTab=='Metadata') {
      this.router.navigate(['/optisam/dm/metadata']);
    }
    else {      
      this.router.navigate(['/optisam/dm/globaldata']);
    }
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}

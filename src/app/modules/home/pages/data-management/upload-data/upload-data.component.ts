// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DataManagementService } from 'src/app/core/services/data-management.service';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss']
})
export class UploadDataComponent implements OnInit {

  uploadForm: FormGroup;
  showMsg: Boolean = false;
  showErrorMsg: Boolean = false;
  errorMessage: String;
  filename: String;
  showFileErrorMessage: Boolean = false;
  loading: Boolean = false;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private dataService: DataManagementService
  ) { }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      'file': ['', [Validators.required]]
    });
  }

  uploadFile() {
    // console.log('hello', this.uploadForm.get('file').value)
    this.loading = true;
    const formData = new FormData();
    formData.append('file1', this.uploadForm.get('file').value);
    this.dataService.uploadDataManagementFile(formData).subscribe(data => {
      // console.log('success', data);
      this.loading = false;
      this.filename = '';
      this.uploadForm.reset();
      this.showErrorMsg = false;
      this.showMsg = true;
      setTimeout(() => { this.showMsg = false; }, 3000);
    }, err => {
      // console.log('error', err);
      this.loading = false;
      this.showErrorMsg = true;
      this.showMsg = false;
      this.errorMessage = err.message;
      setTimeout(() => { this.showErrorMsg = false; }, 3000);
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type !== 'application/x-zip-compressed') {
        this.showFileErrorMessage = true;
        return;
      }
      this.uploadForm.get('file').setValue(file);
      this.filename = file.name;
    }
  }
}

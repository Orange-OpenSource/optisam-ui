// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from 'src/app/core/services/account.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {
  public currLang = 'en';
  public userLang;
  profileForm: FormGroup;
  selectedFile:any;
  url:any;
  base64textString:any='';
  orgProfilePic:any;
  loading:Boolean;
  body:any;
  userID:any;
  profilePicture:any;

  constructor(private accountService: AccountService, 
              private translate: TranslateService,
              private dialog: MatDialog,
              private sharedService: SharedService,
              private sanitizer: DomSanitizer) {
    translate.addLangs(['en', 'fr']);
   }
  selectedLang: string;
  ngOnInit() {
    this.userID = localStorage.getItem('email');
    this.selectedLang = localStorage.getItem('language');
    this.userLang = localStorage.getItem('language');
    this.orgProfilePic = localStorage.getItem('profile_pic');
    this.initForm();
    this.setFormData();
    this.setProfilePic();
  }

  setProfilePic() {
    if(localStorage.getItem('profile_pic') != '') {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl('data:image;base64,' + localStorage.getItem('profile_pic')); 
    } else {
      this.url = null;
    }
  }

  initForm() {
    this.profileForm = new FormGroup({
      'profilePic': new FormControl(null),
      'firstName': new FormControl(null, [Validators.required, Validators.minLength(1),Validators.maxLength(15),
        Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'lastName': new FormControl(null, [Validators.required, Validators.minLength(1),,Validators.maxLength(15),
        Validators.pattern(/^[a-zA-Z0-9_]*$/)]),
      'language': new FormControl(null, [Validators.required])
    });
  }

  setFormData() {
    this.profileForm.controls['firstName'].setValue(localStorage.getItem('first_name'));
    this.profileForm.controls['lastName'].setValue(localStorage.getItem('last_name'));
    this.profileForm.controls['language'].setValue(localStorage.getItem('language'));
    this.profileForm.markAsPristine();
  }

  get profilePic() {
    return this.profileForm.get('profilePic');
  }
  
  get firstName() {
    return this.profileForm.get('firstName');
  }
  
  get lastName() {
    return this.profileForm.get('lastName');
  }
  
  get language() {
    return this.profileForm.get('language');
  }

  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
        width: width,
        disableClose: true
    });
  }

  onFileChanged(event, errMsg) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      if(this.selectedFile.size > 1000000) {
        this.openModal(errMsg, '30%');
        console.log('Image too large!', this.selectedFile.size);
      }
      else {
          var reader = new FileReader();
          reader.onload =this._handleReaderLoaded.bind(this);
          reader.readAsBinaryString(this.selectedFile);
      }
    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString= btoa(binaryString);
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('data:image;base64,' + this.base64textString);
   }

  updateProfile(successMsg, errorMsg) {
    if(this.base64textString !== '') {
      this.body = {
        "user_id" : this.userID,
        "first_name" : this.firstName.value,
        "last_name" : this.lastName.value,
        "locale" : this.language.value,
        "role" : localStorage.getItem('role'),
        "profile_pic" : this.base64textString
      };
    }
    else {
      this.body = {
        "user_id" : this.userID,
        "first_name" : this.firstName.value,
        "last_name" : this.lastName.value,
        "locale" : this.language.value,
        "role" : localStorage.getItem('role')
      };
    }
    this.loading = true;
    this.accountService.updateProfileDetails(this.body,this.userID).subscribe(res=>{
      this.getUpdatedProfileDetails();
      this.profileForm.markAsPristine();
      this.openModal(successMsg, '30%');
      this.loading = false;
      console.log('Details updated successfully!')
    },(err)=> {
      this.openModal(errorMsg, '30%');
      this.loading = false;
      console.log('Some error occured! ', err);
    });
  }

  updateUserLanguage(language: string) {
    this.translate.use(language);
  }

  applyChanges() {
    this.updateUserLanguage(localStorage.getItem('language'));
  }

  getUpdatedProfileDetails() {
    this.accountService.getUserInfo(this.userID)
              .subscribe((res: any) => {
                  localStorage.setItem('first_name', res.first_name);
                  localStorage.setItem('last_name', res.last_name);
                  localStorage.setItem('profile_pic', (res.profile_pic)?(res.profile_pic):'');
                  localStorage.setItem('language', res.locale);
                  this.sharedService.emitProfileChange(true);
                },
                error => {
                  console.log('There was an error while retrieving Posts !!!' + error);
                  this.loading = false;
                });
  }

  resetProfile() {
    this.base64textString = '';
    this.setProfilePic();
    document.getElementById('imageInput').nodeValue = null;
    this.profileForm.reset();
    this.setFormData();
  }
}

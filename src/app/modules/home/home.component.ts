// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public navigationLoading: Boolean;
  navigationSubscription: Subscription;
  public userName:any;
  public role:any;
  sidebarOpenFlag:Boolean = true;
  sidebarWidth:any = 15;
  ngStyle: string;
  profilePicData: any=null;
  firstName:any;
  lastName:any;

  constructor(
    private sharedService: SharedService,
    private sanitizer: DomSanitizer
  ) {
    this.navigationLoading = false;
    this.navigationSubscription = this.sharedService.navigationLoading().subscribe(data => {
      this.navigationLoading = data;
    });
    this.sharedService.getChangedProfile().subscribe(res=> {
      this.firstName = localStorage.getItem('first_name');
      this.lastName = localStorage.getItem('last_name');
      if(localStorage.getItem('profile_pic') != '' && localStorage.getItem('profile_pic') != null)
      {
        this.profilePicData = this.sanitizer.bypassSecurityTrustResourceUrl('data:image;base64,' + localStorage.getItem('profile_pic')); 
      }
      else {
        this.profilePicData = null;
      }
    })
  }

  ngOnInit() {
    this.firstName = localStorage.getItem('first_name');
    this.lastName = localStorage.getItem('last_name');
    let role = localStorage.getItem('role');
    switch(role) {
      case 'ADMIN':
        this.role = 'Admin';
        break;
      case 'USER':
        this.role = 'User';
        break;
      case 'SUPER_ADMIN':
        this.role = 'Super Admin';
        break;
      default:
        this.role = '';
    }
  }

  ngAfterViewInit() {
    const profile_pic = localStorage.getItem('profile_pic');
    const emailId = localStorage.getItem('email');
    if(profile_pic != '') {
      this.profilePicData = this.sanitizer.bypassSecurityTrustResourceUrl('data:image;base64,' + profile_pic); 
    }
    else {
      this.profilePicData = null;
      this.userName = emailId.substring(0, emailId.lastIndexOf('@'));
      var initials = this.firstName.charAt(0).toUpperCase() + this.lastName.charAt(0).toUpperCase();
      document.getElementById("user-icon").innerHTML = initials;
    }
  }
  
  setToggleFlag() {
    this.sidebarOpenFlag = !this.sidebarOpenFlag;
    if(this.sidebarOpenFlag) {
      this.increaseWidth();
    } else {
      this.decreaseWidth();
    }
  }

  increaseWidth() {
    this.sidebarWidth = 15;
  }
  decreaseWidth() {
    this.sidebarWidth = 6;
  }

  profileUpdated(data:any) {
    console.log('Data : ', data);
  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
  }
}

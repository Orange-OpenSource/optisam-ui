// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public name: string;
  public email: string;
  public userName;
  token: string;
  public currLang = 'en';
  public userLang;
  public role: String;
  @Output() toggleSidebar = new EventEmitter();
  public sidebarFlag = false;

  constructor(public router: Router, private authservice: AuthService, private translate: TranslateService) {
    translate.addLangs(['en', 'fr']);
    this.userLang = localStorage.getItem('language') ? localStorage.getItem('language') : 'en';
    this.currLang = this.userLang;
    this.translate.setDefaultLang(this.userLang);
  }
  ngOnInit() {
    this.token = localStorage.getItem(this.authservice.access_token);
    const emailId = localStorage.getItem('email');
    this.userName = emailId.substring(0, emailId.lastIndexOf('@'));
    this.role = localStorage.getItem('role');
    // console.log('this.role========', this.role);
  }
  checkLanguage() {
    // console.log('test--------', localStorage.getItem('language'));
    if ( localStorage.getItem('language') === 'en') {
      this.currLang = localStorage.getItem('language') ;
    } else { if ( localStorage.getItem('language') === 'fr') {
      this.currLang = localStorage.getItem('language') ;
    } else {
      /* this.currLang = language;
      localStorage.setItem('language', language); */
    }
    }

  }
  updateUserLanguage(language: string) {
  /*   if ( localStorage.getItem('language') === 'en') {
      this.currLang = localStorage.getItem('language') ;
    } else { if ( localStorage.getItem('language') === 'fr') {
      this.currLang = localStorage.getItem('language') ;
    } else {
      this.currLang = language;
      localStorage.setItem('language', language);
    }
    } */
    this.currLang = language;
    localStorage.setItem('language', language);
    this.translate.use(language);
  }
  logout() {
    localStorage.clear();
    localStorage.setItem('access_token', '');
    localStorage.setItem('role', '');
    localStorage.getItem('access_token');
    this.router.navigate(['/']);
  }
  langchange() {
    localStorage.getItem('access_token');
    // const emailId = localStorage.getItem('email');
    // this.userName = emailId.substring(0, emailId.lastIndexOf('@'));
    this.router.navigate(['/optisam/settings']);
  }
  toggleSideNavbar() {
    this.sidebarFlag = !this.sidebarFlag;
    this.toggleSidebar.emit(this.sidebarFlag.toString());
  }
}

// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { GroupService } from '../services/group.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/shared.service';

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
  scopesList:any[]=[];
  selectedScope:any;
  newScope:any;
  scopesListOriginal:any=[];

  constructor(public router: Router, 
              private authservice: AuthService, 
              private translate: TranslateService, 
              private dialog: MatDialog,
              private sharedService: SharedService,
              private groupService: GroupService) {
    translate.addLangs(['en', 'fr']);
    this.userLang = localStorage.getItem('language') ? localStorage.getItem('language') : 'en';
    this.currLang = this.userLang;
    this.translate.setDefaultLang(this.userLang);
    this.getScopesList();
  }
  ngOnInit() {
    this.token = localStorage.getItem(this.authservice.access_token);
    const emailId = localStorage.getItem('email') || '';
    this.userName = emailId.substring(0, emailId.lastIndexOf('@'));
    this.role = localStorage.getItem('role');
  }
  checkLanguage() {
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
    this.router.navigate(['/optisam/settings']);
  }
  toggleSideNavbar() {
    this.sidebarFlag = !this.sidebarFlag;
    this.toggleSidebar.emit(this.sidebarFlag.toString());
  }
  getScopesList() {
    this.groupService.getDirectGroups().subscribe((response: any) => {
      response.groups.map(res=>{ res.scopes.map(s=>{this.scopesListOriginal.push(s);});});
      const existingScope= localStorage.getItem('scope');
      this.selectedScope = existingScope?existingScope:this.scopesListOriginal.sort()[0];
      this.scopesList = this.scopesListOriginal.sort().filter(s=>s!==this.selectedScope);
      localStorage.setItem('scope', this.selectedScope);
    }, (error) => {
      console.log("Error fetching groups");
    });
  }
  setScope(scope, warningMsg, dashboardMsg) {
    const currentRoute = this.router.url;
    if(scope !== this.selectedScope) {
      this.newScope = scope;
      if(currentRoute !== '/optisam/dashboard') {
        this.openModal(warningMsg, '40%');
      }
      else {
        this.openModal(dashboardMsg, '40%');
      }
    }
  }

  changeScope() {
    this.selectedScope = this.newScope;
    this.scopesList = this.scopesListOriginal.sort().filter(s=>s!==this.selectedScope);
    localStorage.setItem('scope', this.selectedScope);
    this.sharedService.emitScopeChange(this.newScope);
  }
  backToHome() {
    this.router.navigate(['/']);
  }
  
  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
        width: width,
        disableClose: true
    });
  }
}

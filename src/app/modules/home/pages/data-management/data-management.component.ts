// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataManagementService } from 'src/app/core/services/data-management.service';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})
export class DataManagementComponent implements OnInit, AfterContentChecked {
  tabMenus = [
    { title: 'Data', link: '/optisam/dm/data'},
    { title: 'Metadata', link: '/optisam/dm/metadata'},
    { title: 'Global Data', link: '/optisam/dm/globaldata'}
  ];
  activeLink = this.tabMenus[0].link;
  _loading:Boolean;
  errorMsg: String;

  constructor(private router: Router, 
              private dialog: MatDialog,
              private dpsService: DataManagementService) { 
    this.activeLink = this.router.url; }

  ngOnInit() {
  }
  
  ngAfterContentChecked() {
    this.activeLink = this.router.url;
  }

  deleteInventoryConfirmation(deleteInventoryConfirmation) {
    this.openModal(deleteInventoryConfirmation, '40%');
  }

  deleteInventory(successDialog, errorDialog) {
    this._loading = true;
    this.dpsService.deleteInventory().subscribe(res=>{
      this.dialog.closeAll();
      this.openModal(successDialog, '30%');
      this._loading = false;
    },err=>{
      this.errorMsg = err.error.message||'Some error occured! Could not complete delete operation.';
      this.dialog.closeAll();
      this.openModal(errorDialog, '30%');
      this._loading = false;
    });
  }
  
  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
        width: width,
        disableClose: true
    });
  }
}

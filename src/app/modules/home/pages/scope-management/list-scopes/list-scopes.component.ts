// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from 'src/app/core/services/account.service';
import { CreateScopeComponent } from '../create-scope/create-scope.component';

@Component({
  selector: 'app-list-scopes',
  templateUrl: './list-scopes.component.html',
  styleUrls: ['./list-scopes.component.scss']
})
export class ListScopesComponent implements OnInit {
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;
  scopeData: any[]=[];
  displayedColumns: string[] = [
    'scope_code',
    'scope_name',
    'created_by',
    'created_on',
    'groups'
  ];
  _loading: Boolean = true;
  role:any;

  constructor(
    private sharedService: SharedService,
    private accountService: AccountService,
    public dialog: MatDialog) { 
      dialog.afterAllClosed.subscribe((res)=>this.getScopesList());
    }

  ngOnInit() {
    this.role = localStorage.getItem('role');
  }

  getScopesList() {
    this._loading = true;
    this.scopeData = [];
    this.accountService.getScopesList().subscribe(res=>{
      this.scopeData = res.scopes|| [];
      this._loading = false;
    },err=>{
      this._loading = false;
      console.log('Scopes could not be listed! ', err);
    });
  }

  createNew() {
    const dialogRef = this.dialog.open(CreateScopeComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      maxHeight: '90vh'
    });
  }

}

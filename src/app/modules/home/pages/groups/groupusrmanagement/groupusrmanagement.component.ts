// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GroupService } from 'src/app/core/services/group.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-groupusrmanagement',
  templateUrl: './groupusrmanagement.component.html',
  styleUrls: ['./groupusrmanagement.component.scss']
})
export class GroupusrmanagementComponent implements OnInit {
  deleteMsg: Boolean = false;
  addMsg: Boolean = false;
  errorMsg: Boolean = false;
  eMessage: String;
  dataSource: any;
  grpUserList = [];
  userList = [];
  filterUserList = [];
  emailList = [];
  checkedUsr = [];
  displayedColumns: string[];
  users = new FormControl();
  fullyQualifiedName: String;
  role: String;
  @ViewChild(MatSort) sort: MatSort;
  _loading: Boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data, private groupService: GroupService, private router: Router,
    private _snackBar: MatSnackBar) {
    console.log('DATA-----', data);
    this.role = localStorage.getItem('role');
    this.fullyQualifiedName = data.fully_qualified_name;
  }

  ngOnInit() {
    this.dataLoad();
  }
  loadMessageData() {
    setTimeout(() => {
      this.deleteMsg = false;
      this.addMsg = false;
      this.errorMsg = false;
    }, 2000);

  }
  dataLoad() {
    this.filterUserList = [];
    this.userList = [];
    this.grpUserList = [];
    this.emailList = [];
    this.displayedColumns = ['last_name', 'first_name', 'user_id', 'action'];
    if ((this.role === 'ADMIN') || (this.role === 'SUPER_ADMIN')) {
      this.groupService.getAllUserList(true).subscribe// true implies all users will be listed
        (res => {
          this.userList = res.users;
        },
          error => {
            console.log('There was an error while retrieving Posts !!!' + error);
          });
    }
    this.groupService.getGrpUserList(this.data.ID).subscribe
      (res => {
        this.grpUserList = res.users;
        if (this.grpUserList === undefined || this.grpUserList.length === 0) {
          this.grpUserList = [];
        }
        for (let j = 0; j < this.grpUserList.length; j++) {
          this.emailList.push(this.grpUserList[j].user_id);
        }
        this.dataSource = new MatTableDataSource(this.grpUserList);
        this.dataSource.sort = this.sort;
        this.loadData();
        this._loading = false;
      },
        error => {
          this._loading = false;
          console.log('There was an error while retrieving Posts !!!' + error);
        });

  }
  loadData() {
    for (let i = 0; i < this.userList.length; i++) {
      if (!this.emailList.includes(this.userList[i].user_id)) {
        this.filterUserList.push(this.userList[i]);
      }
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onCheked(data, userID) {
    if (data.checked === true) {
      this.checkedUsr.push(userID);
    } else {
      for (let i = 0; i < this.checkedUsr.length; i++) {
        if (this.checkedUsr[i] === userID) {
          this.checkedUsr.splice(this.checkedUsr.indexOf(userID), 1);
        }
      }
    }
  }
  delete() {
    if(this.checkedUsr) {
      const data = { 'group_id': this.data.ID, 'user_id': this.checkedUsr };
      this.groupService.deleteGrpUser(this.data.ID, data).subscribe
        (res => {
          this.userList = res.users;
          this.deleteMsg = true;
          this.addMsg = false;
          this.errorMsg = false;
          this.dataLoad();
          this.checkedUsr = [];
          this.loadMessageData();
        },
          error => {
            this.deleteMsg = false;
            this.addMsg = false;
            this.errorMsg = true;
            this.eMessage = error.message;
            this.loadMessageData();
            console.log('There was an error while retrieving Posts !!!' + error);
          });
    }
    else {
      this.deleteMsg = false;
      this.addMsg = false;
      this.errorMsg = true;
      this.eMessage = 'Please select User';
      this.loadMessageData();
    }
  }

  addUser() {
    const userId = [];
    if(this.users.value) {
      for (let i = 0; i < this.users.value.length; i++) {
        userId.push(this.users.value[i].user_id);
      }
      const data = { 'group_id': this.data.ID, 'user_id': userId };
      this.groupService.addGrpUser(this.data.ID, data).subscribe
        (res => {
          this.userList = res.users;
          this.addMsg = true;
          this.deleteMsg = false;
          this.errorMsg = false;
          this.dataLoad();
          this.loadMessageData();
        },
          error => {
            this.deleteMsg = false;
            this.addMsg = false;
            this.errorMsg = true;
            this.eMessage = error.message;
            this.loadMessageData();
            console.log('There was an error while retrieving Posts !!!' + error);
          });
    }
    else {
      this.deleteMsg = false;
      this.addMsg = false;
      this.errorMsg = true;
      this.eMessage = 'Please select User';
      this.loadMessageData();
    }
  }
}

import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GroupService } from 'src/app/core/services/group.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';



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
  userList = [] ;
  filterUserList = [];
  emailList = [];
  checkedUsr = [];
  displayedColumns: string[];
  toppings = new FormControl();
  fullyQualifiedName: String;
  role: String;
  @ViewChild(MatSort) sort: MatSort;
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(@Inject(MAT_DIALOG_DATA) public data, private groupService: GroupService, private router: Router,
   private _snackBar: MatSnackBar) {
     console.log('DATA-----', data);
     this.role = localStorage.getItem('role');
     this.fullyQualifiedName = data.fully_qualified_name;
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
  this.groupService.getAllUserList().subscribe
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
    for (let j = 0; j < this.grpUserList.length; j++ ) {
      /*this.userList.splice(this.userList.indexOf(this.grpUserList[j]), 1 ); */
      this.emailList.push(this.grpUserList[j].user_id);
    }
    this.dataSource = new MatTableDataSource(this.grpUserList);
    this.dataSource.sort = this.sort;
    this.loadData();
  },
  error => {
    console.log('There was an error while retrieving Posts !!!' + error);
  });

}
  ngOnInit() {
    this.dataLoad();
  }
  loadData() {
    console.log('this.userList---->', this.userList);
    console.log('this.grpUserList---->', this.grpUserList);
   for ( let i = 0 ; i < this.userList.length; i++) {
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
        if (this.checkedUsr[i] === userID ) {
          this.checkedUsr.splice(this.checkedUsr.indexOf(userID), 1 );
          // delete this.checkedUsr[i];
        }

      }
    }
  console.log('final---arr--', this.checkedUsr);
  }
  delete() {
    if (this.checkedUsr === undefined || this.checkedUsr.length === 0) {
      this.deleteMsg = false;
      this.addMsg = false;
      this.errorMsg = true;
      this.eMessage = 'Please select User';
      this.loadMessageData();
      // array empty or does not exist
  } else {
    const data = {'group_id': this.data.ID, 'user_id': this.checkedUsr};
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
  }
  addUser() {

    /* console.log('toppings--', this.toppings.value); */
    const userId = [];
  if ( this.toppings.value === null) {
    this.deleteMsg = false;
    this.addMsg = false;
    this.errorMsg = true;
    this.eMessage = 'Please select User';
    this.loadMessageData();

  } else {
    if (this.toppings.value === undefined || this.toppings.value.length === 0 || this.toppings.value === null) {
      this.deleteMsg = false;
      this.addMsg = false;
      this.errorMsg = true;
      this.eMessage = 'Please select User';
      this.loadMessageData();
      // array empty or does not exist
  } else {
   /*  if(userId.) */
   for (let i = 0; i < this.toppings.value.length; i++) {
    userId.push(this.toppings.value[i].user_id);

  }
    const data = {'group_id': this.data.ID, 'user_id': userId};
    this.groupService.addGrpUser(this.data.ID, data).subscribe
    (res => {
      this.userList = res.users;
      this.addMsg = true;
      this.deleteMsg = false;
      this.errorMsg = false;
      this.dataLoad();
      this.loadMessageData();
   /*    this._snackBar.open('message', 'action', {
        duration: 2000,
      }); */
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
}
  }
}

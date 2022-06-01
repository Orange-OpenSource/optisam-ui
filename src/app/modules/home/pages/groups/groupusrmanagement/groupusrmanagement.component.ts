import { Component, OnInit, Inject, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupService } from 'src/app/core/services/group.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';
@Component({
  selector: 'app-groupusrmanagement',
  templateUrl: './groupusrmanagement.component.html',
  styleUrls: ['./groupusrmanagement.component.scss']
})
export class GroupusrmanagementComponent implements OnInit {
  _loading: Boolean;
  errorMessage: string;
  group: any;
  usersList: any[]=[];
  groupUsersList: any[]=[];
  filteredUsersList:string[]=[];
  users = new FormControl();
  usersToDelete:any[]=[];
  dataSource: MatTableDataSource<any>;
  disableAddBtn: Boolean;
  disableDeleteBtn: Boolean;
  dialogRef:any;
  displayedColumns:string[] = [
    'last_name',
    'first_name',
    'user_id',
    'action'
  ];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChildren('deleteCheckbox') private deleteCheckboxes : QueryList<any>;
  actionSuccessful:Boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data, 
              private dialog: MatDialog,
              private groupService: GroupService) {
    this.group = this.data;
  }

  ngOnInit() {
    this.getAllUsersLists();
  }
  

  formatAsColumnName(property) {
    if (property === 'user_id') {
      return 'Email';
    }
    let formatedProperty = '';
    const alphabets = property.split('_');
    for (let i = 0; i < alphabets.length; i++) {
      if (i === 0) {
        formatedProperty = alphabets[i].split('')[0].toUpperCase() + alphabets[i].substring(1, alphabets[i].length).toLowerCase()
      }
      else {
        formatedProperty += (' ' + alphabets[i].split('')[0].toUpperCase() + alphabets[i].substring(1, alphabets[i].length).toLowerCase());
      }
    }
    return formatedProperty;
  }

  applyFilter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllUsersInfo(): Observable<any> {
    return forkJoin([
      this.groupService.getAllUserList(true),
      this.groupService.getGrpUserList(this.group.ID)
    ]);
  }

  // Get lists of all users, existing users of the Group & non-existing users of the Group
  getAllUsersLists() {
    this._loading = true;
    this.getAllUsersInfo().subscribe(res=>{
      this.usersList = res[0].users||[];
      this.usersList = this.usersList.sort((a, b) => {
        if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) return 1;
        if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) return -1;
        return 0;
      });
      this.groupUsersList = res[1].users||[];
      this.dataSource = new MatTableDataSource(this.groupUsersList);
      this.dataSource.sort = this.sort;
      this.filteredUsersList = this.usersList.filter(res=>{ 
        if(!this.groupUsersList.map(user=>user.user_id).includes(res.user_id)) {return res}
      });

      this._loading = false;
    }, err=>{
      this._loading = false;
      console.log('Could not get all users.',err);
    });
  }

  addUser(successMsg,errorMsg) {
    const body = {
      "group_id": this.group.ID,
      "user_id": this.users.value.map(user=>user.user_id)
    }
    this.disableAddBtn = true;
    this.groupService.addGrpUser(this.group.ID, body).subscribe(res=>{
      this.actionSuccessful = true;
      this.openModal(successMsg,'30%');
      this.resetUsers();
      this.getAllUsersLists();
      this.disableAddBtn = false;
    }, err=>{
      this.actionSuccessful = false;
      this.disableAddBtn = false;
      this.errorMessage = err.error.message;
      this.openModal(errorMsg,'30%');
      console.log('Could not delete selected users.', err);
    });
  }

  selectForDelete(data,userId) {
    if (data.checked === true) {
      this.usersToDelete.push(userId);
    } else {
      for (let i = 0; i < this.usersToDelete.length; i++) {
        if (this.usersToDelete[i] === userId) {
          this.usersToDelete.splice(this.usersToDelete.indexOf(userId), 1);
        }
      }
    }
    console.log(this.usersToDelete);
  }

  deleteUser(successMsg,errorMsg) {
    const body = {
      "group_id": this.group.ID,
      "user_id": this.usersToDelete
    }
    this.disableDeleteBtn = true;
    this.groupService.deleteGrpUser(this.group.ID, body).subscribe(res=>{
      this.actionSuccessful = true;
      this.openModal(successMsg,'30%');
      this.resetUsers();
      this.getAllUsersLists();
      this.disableDeleteBtn = false;
    }, err=>{
      this.actionSuccessful = false;
      this.disableDeleteBtn = false;
      this.errorMessage = err.error.message;
      this.openModal(errorMsg,'30%');
      console.log('Could not delete selected users.', err);
    });
  }

  resetUsers() {
    // clear users select list
    this.users.reset();
    // clear delete users list and selected checkboxes
    this.usersToDelete = [];      
    let checkboxes = this.deleteCheckboxes.toArray();
    checkboxes.forEach(c=>c.checked = false);
  }

  openModal(templateRef,width) {
    this.dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
  
  ngOnDestroy() {
    this.dialog.closeAll();
  }
}

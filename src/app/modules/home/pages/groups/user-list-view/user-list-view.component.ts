import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from 'src/app/core/services/group.service';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { CreateUserGrpComponent } from '../create-user-grp/create-user-grp.component';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list-view',
  templateUrl: './user-list-view.component.html',
  styleUrls: ['./user-list-view.component.scss']
})
export class UserListViewComponent implements OnInit {
  role:any;
  userList:any[]=[];
  dataSource:any;
  displayedColumns: string[];
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  _loading:Boolean=true;
  userToUpdate:any;
  userToDelete:any;
  roles:any[] = [];
  editRoleFlag: Boolean = false;
  selectedUser: string ='';
  selectedRole: string = '';
  _deleteInProgress:boolean;
  errorMsg:string;

  constructor(private groupService:GroupService,
    public dialog: MatDialog) {
    this.role = localStorage.getItem('role');
   }

  ngOnInit() {
    this.roles.push('ADMIN');
    this.roles.push('USER');
    this.loadData();
  }

  loadData() {
    this._loading = true;
    this.userList = [];
    this.dataSource = null;
    if ((this.role === 'ADMIN') || (this.role === 'SUPER_ADMIN')) {
      this.displayedColumns = ['last_name', 'first_name', 'user_id', 'groups', 'role', 'action'];
      this.groupService.getAllUserList(false).subscribe//false implies users will be listed depending on some conditions
      (res => {
        this.userList = res.users;
        this.dataSource = new MatTableDataSource(this.userList);
        this.dataSource.sort = this.sort;
        this._loading = false;
      },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
        this._loading = false;
      });
    }
  }

  openModal(templateRef,width) {
    let dialogRef = this.dialog.open(templateRef, {
        width: width,
        disableClose: true
    });
  }
  
  addNew() {
    const dialogRef = this.dialog.open(CreateUserGrpComponent, {
      data: {},
      maxHeight:"500px",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
      if(successEvent){
        this.loadData();
      }
    });
  }
  editUser(user) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      maxHeight: '500px',
      disableClose: true,
      data: {
          datakey : user
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
      if(successEvent){
        this.loadData();
      }
    });
  }

  deleteUserConfirmation(user, templateRef) {
    this.userToDelete = user;
    this.openModal(templateRef,'40%');
  }

  deleteUser(successMsg, errorMsg) {
    this._deleteInProgress = true;
    this.groupService.deleteUser(this.userToDelete.user_id).subscribe(res => {
      this.dialog.closeAll();
      this.openModal(successMsg,'30%');
      this._deleteInProgress = false;
    },
      (error) => {
        this.dialog.closeAll();
        this.errorMsg = error.error.message||'Some error occured! User could not be deleted';
        this.openModal(errorMsg,'30%');
        this._deleteInProgress = false;
      });
  }
  
  ngOnDestroy() {
    this.dialog.closeAll();
  }
}

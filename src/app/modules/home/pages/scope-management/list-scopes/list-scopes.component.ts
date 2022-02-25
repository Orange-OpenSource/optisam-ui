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
    'scope_type',
    'created_by',
    'created_on',
    'groups',
    'action'
  ];
  _loading: Boolean = true;
  _deleteLoading: Boolean;
  role:any;
  scopeToDelete:string;
  errorMessage:string;

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog) { 
      this.role = localStorage.getItem('role');
    }

  ngOnInit() {
    this.getScopesList();
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
    dialogRef.afterClosed().subscribe(result => {
      const successEvent = dialogRef.componentInstance.actionSuccessful;
      if(successEvent){
        this.getScopesList();
      }
    });
  }

  deleteScopeConfirmation(scope, templateRef) {
    this.scopeToDelete = scope.scope_code;
    this.openModal(templateRef,'40%');
  }

  deleteScope(successMsg, errorMsg) {
    this._deleteLoading = true;
    this.accountService.deleteScope(this.scopeToDelete).subscribe(res => {
      this.dialog.closeAll();
      this._deleteLoading = false;
      this.openModal(successMsg,'30%');
      console.log('Successfully Deleted! ', this.scopeToDelete);
    },
      (error) => {
        this.dialog.closeAll();
        this._deleteLoading = false;
        this.errorMessage = error.error.message || 'Some error occured! Could not delete scope';
        this.openModal(errorMsg,'30%');
        console.log('Error occured while deleting user!');
      });
  }

  openModal(templateRef,width) {
    let dialogRef = this.dialog.open(templateRef, {
        width: width,
        disableClose: true
    });
  }

}

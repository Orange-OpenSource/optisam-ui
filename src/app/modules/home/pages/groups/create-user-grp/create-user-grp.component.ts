import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-create-user-grp',
  templateUrl: './create-user-grp.component.html',
  styleUrls: ['./create-user-grp.component.scss']
})
export class CreateUserGrpComponent implements OnInit {
  groupForm: FormGroup;
  groupsList: any;
  roles = [];
  errorMsg: any;
  _loading: boolean;
  public actionSuccessful:boolean;

  constructor(
    private groupService: GroupService,
    private router: Router,
    private dialog: MatDialog
  ) { }
  ngOnInit() {
    this.roles.push('ADMIN');
    this.roles.push('USER');
    this.listGroups();
    this.groupForm = new FormGroup({
      'first_name': new FormControl('', [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]),
      'last_name': new FormControl('', [Validators.required, Validators.pattern(/^\S+(?: \S+)*$/)]),
      'user_id': new FormControl('', [Validators.required, Validators.email]),
      'groups': new FormControl(''),
      'role': new FormControl('', [Validators.required])
    });
  }
  get first_name() {
    return this.groupForm.get('first_name');
  }
  get last_name() {
    return this.groupForm.get('last_name');
  }
  get user_id() {
    return this.groupForm.get('user_id');
  }
  get groups() {
    return this.groupForm.get('groups');
  }
  get role() {
    return this.groupForm.get('role');
  }

  listGroups() {
    this.groupService.getGroups().subscribe(res => {
      this.groupsList = res.groups.filter(group => group.ID !== "1");
    },
      error => {
        console.log('There was an error while retrieving Posts !!!' + error);
      });
  }

  createGroup(successMsg, errorMsg) {
    this._loading = true;
    this.groupForm.markAsPristine();
    const data = this.groupForm.value;
    if (this.groups.value && this.groups.value.length > 0) { data.groups = this.groups.value.map(group => group.ID); }
    else {
      data.groups = [];
    }
    data.locale = 'en';
    this.groupService.createUser(data).subscribe(res => {
      this.actionSuccessful = true;
      this.openModal(successMsg);
      this._loading = false;
    },
      (error) => {
        this.actionSuccessful = false;
        this.errorMsg = error.error.message || 'Some error occured! User could not be created';
        this.openModal(errorMsg);
        this._loading = false;
      });
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true
    });
  }
  backToList() {
    this.router.navigate(['/optisam/gr/viewUsers']);
  }

  resetGroup() {
    this.groupForm.reset();
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
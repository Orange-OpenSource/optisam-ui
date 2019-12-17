import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { GroupService } from 'src/app/core/services/group.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router} from '@angular/router';

@Component({
  selector: 'app-edit-grp-name',
  templateUrl: './edit-grp-name.component.html',
  styleUrls: ['./edit-grp-name.component.scss']
})
export class EditGrpNameComponent implements OnInit {
fullyQualifyName: String;
editName: String;
nameRequired: Boolean;
showMsg: Boolean;
  constructor(@Inject (MAT_DIALOG_DATA) public data, private groupService: GroupService, private router: Router) { }

  ngOnInit() {
    console.log('data---------', this.data);
    this.editName = this.data.node.name;
    this.fullyQualifyName = this.data.node.fully_qualified_name;
  }
  changeVal(editName) {
  }
  saveEditName(data) {
    if (this.editName === '' || this.editName === null) {
      console.log('1');
      this.nameRequired = true;
    } else {
      console.log('2');
     data = {'group_id': this.data.node.ID,
             'group': {
              'name': this.editName.trim()}};
      this.groupService.editName(this.data.node.ID, data).subscribe(res => {
        console.log('res----', res);
        this.showMsg = true;
      },
        error => {
          console.log('Fetch direct Group response ERROR !!!' + error);
          this.showMsg = false;
        });
      this.nameRequired = false;
    }

  }
}

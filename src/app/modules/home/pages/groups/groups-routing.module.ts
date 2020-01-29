// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { GroupmangementComponent } from './groupmangement/groupmangement.component';
import { CreateUserGrpComponent } from './create-user-grp/create-user-grp.component';
import { EditGrpNameComponent } from './edit-grp-name/edit-grp-name.component';
import { GroupusrmanagementComponent } from './groupusrmanagement/groupusrmanagement.component';

const routes: Routes = [
  {
    path: '', component: GroupsComponent,
    children: [
      { path: 'createGroup', component: CreateGroupComponent },
      { path: 'groupMang', component: GroupmangementComponent },
      { path: 'userGroup', component: CreateUserGrpComponent },
      { path: 'editGroup', component: EditGrpNameComponent },
      {path: 'groupUsrMange', component: GroupusrmanagementComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }

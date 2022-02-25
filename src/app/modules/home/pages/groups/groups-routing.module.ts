import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { GroupmangementComponent } from './groupmangement/groupmangement.component';
import { CreateUserGrpComponent } from './create-user-grp/create-user-grp.component';
import { EditGrpNameComponent } from './edit-grp-name/edit-grp-name.component';
import { GroupusrmanagementComponent } from './groupusrmanagement/groupusrmanagement.component';
import { UserListViewComponent } from './user-list-view/user-list-view.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
  {
    path: '', component: GroupsComponent,
    children: [
      { path: 'createGroup', component: CreateGroupComponent },
      { path: 'groupMang', component: GroupmangementComponent },
      { path: 'userGroup', component: CreateUserGrpComponent },
      { path: 'editGroup', component: EditGrpNameComponent },
      { path: 'groupUsrMange', component: GroupusrmanagementComponent },
      { path: 'viewUsers', component : UserListViewComponent },
      { path: 'editUsers', component : EditUserComponent}

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataManagementComponent } from './data-management.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';
import { ListDataComponent } from './list-data/list-data.component';
import { ListMetadataComponent } from './list-metadata/list-metadata.component';
import { ListGlobaldataComponent } from './list-globaldata/list-globaldata.component';
import { NominativeUsersComponent } from './nominative-users/nominative-users.component';
import { ConcurrentUsersComponent } from './concurrent-users/concurrent-users.component';
import { AllowSpecificScopesGuard } from '@core/guards/allow-specific-scopes.guard';

const routes: Routes = [
  {
    path: '',
    component: DataManagementComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] },
        children: [
          {
            path: 'data',
            component: ListDataComponent,
          },
          {
            path: 'data/:globalFileId',
            component: ListDataComponent,
          },
          {
            path: 'metadata',
            component: ListMetadataComponent,
            canActivate: [AllowSpecificScopesGuard],
          },
          {
            path: 'globaldata',
            component: ListGlobaldataComponent,
          },
          {
            path: 'upload-data',
            component: UploadDataComponent,
          },
        ],
      },
      {
        path: 'nominative-users',
        component: NominativeUsersComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] },
      },

      {
        path: 'concurrent-users',
        component: ConcurrentUsersComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataManagementRoutingModule {}

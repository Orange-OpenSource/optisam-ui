import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataManagementComponent } from './data-management.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';
import { ListDataComponent } from './list-data/list-data.component';
import { ListMetadataComponent } from './list-metadata/list-metadata.component';
import { ListGlobaldataComponent } from './list-globaldata/list-globaldata.component';
import { AllowScopesGuard } from '@core/guards/allow-scopes.guard';

const routes: Routes = [
  {
    path: '',
    component: DataManagementComponent,
    children: [
      {
        path: 'data',
        component: ListDataComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] },
      },
      {
        path: 'data/:globalFileId',
        component: ListDataComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] },
      },
      {
        path: 'metadata',
        component: ListMetadataComponent,
        canActivate: [AuthGuard, AllowScopesGuard],
        data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] },
      },
      {
        path: 'globaldata',
        component: ListGlobaldataComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] },
      },
      {
        path: 'upload-data',
        component: UploadDataComponent,
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

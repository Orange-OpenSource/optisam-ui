import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataManagementComponent } from './data-management.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';
import { ListDataComponent } from './list-data/list-data.component';
import { ListMetadataComponent } from './list-metadata/list-metadata.component';
import { ListGlobaldataComponent } from './list-globaldata/list-globaldata.component';
import { AllowSpecificScopesGuard } from '@core/guards/allow-scopes.guard';
import { AllowGenericScopesGuard } from '@core/guards/allow-generic-scopes.guard';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataManagementRoutingModule {}

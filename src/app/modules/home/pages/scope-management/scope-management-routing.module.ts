import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListScopesComponent } from './list-scopes/list-scopes.component';
import { CreateScopeComponent } from './create-scope/create-scope.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';

const routes: Routes = [
  {
    path: '',
    component: ListScopesComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] },
  },
  {
    path: 'create',
    component: CreateScopeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf()] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScopeManagementRoutingModule {}

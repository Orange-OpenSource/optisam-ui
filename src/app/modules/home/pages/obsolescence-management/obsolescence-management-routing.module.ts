import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';
import { DefineObsolescenceScaleComponent } from './define-obsolescence-scale/define-obsolescence-scale.component';

const routes: Routes = [
{ 
  path: 'define-obsolescence', 
  component: DefineObsolescenceScaleComponent, 
  canActivate: [AuthGuard],
  data: { roles: [Role.Admin.valueOf(), Role.SuperAdmin.valueOf()] }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObsolescenceManagementRoutingModule { }

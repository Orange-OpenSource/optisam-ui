import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';
import { GroupComplianceComponent } from './group-compliance.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'charts',
    pathMatch: 'full',
  },
  {
    path: 'charts',
    component: GroupComplianceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupComplianceRoutingModule { }

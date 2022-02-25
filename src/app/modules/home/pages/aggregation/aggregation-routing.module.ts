import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAggregationComponent } from './create-aggregation/create-aggregation.component';
import { ListAggregationComponent } from './list-aggregation/list-aggregation.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';

const routes: Routes = [
  {
    path: 'create-aggregation', component: CreateAggregationComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] }
  },
  { path: 'list-aggregation', component: ListAggregationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AggregationRoutingModule { }

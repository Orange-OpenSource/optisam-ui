import { Routes } from '@angular/router';
import { Role } from 'src/app/utils/roles.config';
import { AuthGuard } from '@core/guards/auth.guard';
import { ListCoreFactorComponent } from './list-core-factor/list-core-factor.component';

export const routes: Routes = [
  {
    path: 'list-core-factor',
    component: ListCoreFactorComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf(), Role.Admin.valueOf()] },
  },
];

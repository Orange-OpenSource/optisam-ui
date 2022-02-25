import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

const routes: Routes = [
{
  path: 'optisam',
  loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
  canActivate : [AuthGuard]
},
 {path: '', loadChildren: () => import('./core/auth/login/login.module').then(m => m.LoginModule), canActivate: [NoAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

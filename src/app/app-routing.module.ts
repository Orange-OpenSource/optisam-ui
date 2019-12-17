import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

const routes: Routes = [
{
  path: 'optisam',
  loadChildren: './modules/home/home.module#HomeModule',
  canActivate : [AuthGuard]
},
 {path: '', loadChildren: './core/auth/login/login.module#LoginModule', canActivate: [NoAuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

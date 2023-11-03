import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { IsValidLinkResolver } from '@core/user-activation/is-valid-link.resolver';
import { PasswordAction } from '@core/modals';
// import { ForgotPasswordComponent } from 'src/app/modules/forgot-password/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: 'optisam',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./core/auth/login/login.module').then((m) => m.LoginModule),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'user-activation',
    loadChildren: () =>
      import('./core/user-activation/user-activation.module').then((m) => m.UserActivationModule),
    resolve: {
      data: IsValidLinkResolver
    },
    data: { type: PasswordAction.activation }
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./modules/forgot-password/forgot-password.module').then((m) => m.ForgotPasswordModule)
  },

  {
    path: 'reset-password',
    loadChildren: () =>
      import('./core/reset-password/reset-password.module').then((m) => m.ResetPasswordModule),
    resolve: {
      data: IsValidLinkResolver
    },
    data: { type: PasswordAction.reset }
  },

  {
    path: '',
    loadChildren: () =>
      import('./core/landing-page/landing-page.module').then(
        (m) => m.LandingPageModule
      ),
    canActivate: [NoAuthGuard],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

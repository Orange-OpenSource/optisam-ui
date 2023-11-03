import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserActivationComponent } from './user-activation/user-activation.component';


const routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UserActivationComponent
  },

  {
    path: "**",
    RedirectTo: ''
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserActivationRoutingModule { }

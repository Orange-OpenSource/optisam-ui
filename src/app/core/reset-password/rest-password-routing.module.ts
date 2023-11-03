import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserResetPasswordComponent } from './user-reset-password/user-reset-password.component';


const routes = [
    {
        path: '',
        pathMatch: 'full',
        component: UserResetPasswordComponent
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
export class ResetPasswordRoutingModule { }

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password.component";

const routes = [{
    path: '',
    component: ForgotPasswordComponent
},
{
    path: "**",
    redirectTo: '/'
}
]


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ForgotPasswordRoutingModule {

}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ForgotPasswordRetrieveSentComponent } from './forgot-password-retrieve-sent/forgot-password-retrieve-sent.component';



@NgModule({
  declarations: [ForgotPasswordComponent, ForgotPasswordRetrieveSentComponent],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    SharedModule
  ]
})
export class ForgotPasswordModule { }

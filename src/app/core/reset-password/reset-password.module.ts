import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserResetPasswordComponent } from './user-reset-password/user-reset-password.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { SharedModule } from '@shared/shared.module';
import { ResetPasswordRoutingModule } from './rest-password-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [UserResetPasswordComponent],
  imports: [
    CommonModule,
    CustomMaterialModule,
    SharedModule,
    ResetPasswordRoutingModule,
    RouterModule
  ]
})
export class ResetPasswordModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserActivationComponent } from './user-activation/user-activation.component';
import { UserActivationRoutingModule } from './user-activation-routing.module';
import { CustomMaterialModule } from 'src/app/material.module';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [UserActivationComponent],
  imports: [
    CommonModule,
    UserActivationRoutingModule,
    CustomMaterialModule,
    SharedModule
  ]
})
export class UserActivationModule {

}

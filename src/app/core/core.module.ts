import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppModule } from '../app.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserChangePasswordComponent } from '../shared/user-change-password/user-change-password.component';
import { ForgotPasswordComponent } from '../modules/forgot-password/forgot-password/forgot-password.component';
/* import { LoaderComponent } from './loader/loader.component'; */


@NgModule({
  declarations: [UserChangePasswordComponent, ForgotPasswordComponent],
  imports: [
    CommonModule,
    TranslateModule,
    AppModule,
    FlexLayoutModule
  ],
  exports: [
    TranslateModule]

})
export class CoreModule { }

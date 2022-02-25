import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { routes } from './core-factor-management.route';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ListCoreFactorComponent } from './list-core-factor/list-core-factor.component';
import { CoreFactorUploadComponent } from './core-factor-upload/core-factor-upload.component';
import { ActivityLogComponent } from './core-factor-upload/activity-log/activity-log.component';
import { SuccessMessageComponent } from './core-factor-upload/success-message/success-message.component';

@NgModule({
  declarations: [
    ListCoreFactorComponent,
    CoreFactorUploadComponent,
    ActivityLogComponent,
    SuccessMessageComponent,
  ],
  imports: [
    CommonModule,
    CustomMaterialModule,
    SharedModule,
    TranslateModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
  ],
})
export class CoreFactorManagementModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppModule } from '../app.module';
import { FlexLayoutModule } from '@angular/flex-layout';
/* import { LoaderComponent } from './loader/loader.component'; */


@NgModule({
  declarations: [],
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

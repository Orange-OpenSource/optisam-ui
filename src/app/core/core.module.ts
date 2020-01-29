// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

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

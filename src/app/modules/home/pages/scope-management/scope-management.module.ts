// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScopeManagementRoutingModule } from './scope-management-routing.module';
import { ListScopesComponent } from './list-scopes/list-scopes.component';
import { CreateScopeComponent } from './create-scope/create-scope.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ListScopesComponent, CreateScopeComponent],
  imports: [
    CustomMaterialModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    ScopeManagementRoutingModule,
    TranslateModule
  ]
})
export class ScopeManagementModule { }

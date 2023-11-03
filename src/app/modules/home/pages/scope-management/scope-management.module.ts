import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScopeManagementRoutingModule } from './scope-management-routing.module';
import { ListScopesComponent } from './list-scopes/list-scopes.component';
import { CreateScopeComponent } from './create-scope/create-scope.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SetExpenditureComponent } from './set-expenditure/set-expenditure.component';

@NgModule({
  declarations: [ListScopesComponent, CreateScopeComponent, SetExpenditureComponent],
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

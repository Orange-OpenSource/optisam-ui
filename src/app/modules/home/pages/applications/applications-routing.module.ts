// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AplDetailsComponent } from './apl-details/apl-details.component';
import { ApplicationsComponent } from './applications.component';
import { AplComponent } from './apl/apl.component';
import { ProdEquiComponent } from '../products/prod-equi/prod-equi.component';


const routes: Routes = [
  {
  path: '', component: ApplicationsComponent,
children: [
      { path: 'applications', component: AplComponent },
      { path: 'applications/:key', component: AplDetailsComponent},
      { path: 'applications/:key/:swidTag', component:ProdEquiComponent}
      
]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class ApplicationsRoutingModule { }

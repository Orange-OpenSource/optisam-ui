import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AplDetailsComponent } from './apl-details/apl-details.component';
import { ApplicationsComponent } from './applications.component';
import { AplComponent } from './apl/apl.component';


const routes: Routes = [
  {
  path: '', component: ApplicationsComponent,
children: [
      { path: 'applications', component: AplComponent },
      { path: 'applications/:key', component: AplDetailsComponent}
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

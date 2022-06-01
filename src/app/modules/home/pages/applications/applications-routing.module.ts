import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AplDetailsComponent } from './apl-details/apl-details.component';
import { AplProductDetailsComponent } from './apl-product-details/apl-product-details.component';
import { ApplicationsComponent } from './applications.component';
import { AplComponent } from './apl/apl.component';
import { ProdEquiComponent } from '../products/prod-equi/prod-equi.component';
import { AplInstanceComponent } from '../products/apl-instance/apl-instance.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
    children: [
      { path: 'applications', component: AplComponent },
      { path: 'applications/:key', component: AplDetailsComponent },
      {
        path: 'applications/instances/:key/:inst_id',
        component: AplProductDetailsComponent,
      },
      { path: 'applications/:key/:swidTag', component: ProdEquiComponent },
      { path: 'instances/:app_id', component: AplInstanceComponent },
      { path: 'instances/:app_id/:inst_id', component: ProdEquiComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ApplicationsRoutingModule {}

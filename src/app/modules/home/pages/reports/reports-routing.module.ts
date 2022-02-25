import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListReportsComponent } from './list-reports/list-reports.component';
import { CreateReportComponent } from './create-report/create-report.component';

// const routes: Routes = [];
const routes: Routes = [
  {
    path: '', component: ListReportsComponent
  },
  {
    path: 'create', component : CreateReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }

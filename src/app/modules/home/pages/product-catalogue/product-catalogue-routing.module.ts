import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { Role } from 'src/app/utils/roles.config';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { CreateEditorComponent } from './editor/create-editor/create-editor.component';
import { EditorListComponent } from './editor/editor-list/editor-list.component';
import { ProductListComponent } from './products/product-list/product-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'editors',
    pathMatch: 'full',
  },
  {
    path: 'editors',
    component: EditorListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf()] },
  },
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf()] },
  },
  {
    path: 'products/create',
    component: CreateProductComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf()] },
  },
  {
    path: 'products/update/:id',
    component: CreateProductComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf()] },
  },
  {
    path: 'editors/create',
    component: CreateEditorComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf()] },
  },
  {
    path: 'editors/update/:id',
    component: CreateEditorComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.SuperAdmin.valueOf()] },
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCatalogueRoutingModule {}

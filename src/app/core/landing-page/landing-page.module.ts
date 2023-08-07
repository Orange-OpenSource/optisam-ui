import { ProductsListsComponent } from './editor-detail/products-lists/products-lists.component';
import { EditorInfoComponent } from './editor-detail/editor-info/editor-info.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { CustomMaterialModule } from 'src/app/material.module';
import { EditorDetailsComponent } from './editor-details/editor-details.component';
import { EditorsListComponent } from './editors-list/editors-list.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AboutsComponent } from './abouts/abouts.component';
import { CheckHeaderPipe } from './pipes/check-header.pipe';
import { MakeLinkPipe } from './pipes/make-link.pipe';
import { EditorsListThumbnailComponent } from './editors-list-thumbnail/editors-list-thumbnail.component';
import { EditorSearchBarComponent } from './editors-list-thumbnail/editor-search-bar/editor-search-bar.component';
import { EditorFiltersComponent } from './editors-list-thumbnail/editor-filters/editor-filters.component';
import { EditorItemThumbComponent } from './editors-list-thumbnail/editor-item-thumb/editor-item-thumb.component';
import { ScrollPaginationDirective } from './editors-list-thumbnail/scroll-pagination.directive';
import { ProductsListThumbnailComponent } from './products-list-thumbnail/products-list-thumbnail.component';
import { RemainingEntitiesPipe } from './editors-list-thumbnail/editor-item-thumb/pipes/remaining-entities.pipe';
import { IsFlagAvailablePipe } from './editors-list-thumbnail/editor-item-thumb/pipes/is-flag-available.pipe';
import { ProductItemThumbComponent } from './products-list-thumbnail/product-item-thumb/product-item-thumb.component';
import { ProductLicensePipe } from './pipes/product-license.pipe';
import { ProductFiltersComponent } from './products-list-thumbnail/product-filters/product-filters.component';
import { ProductSearchBarComponent } from './products-list-thumbnail/product-search-bar/product-search-bar.component';
import { EditorDetailComponent } from './editor-detail/editor-detail.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductContentComponent } from './product-detail/product-content/product-content.component';
import { TrimTextRangePipe } from './editors-list-thumbnail/editor-item-thumb/pipes/trim-text-range.pipe';
import { JoinVendorsPipe } from './editor-detail/editor-info/join-vendors.pipe';
import { EditorInfoV2Component } from './editor-detail/editor-info-v2/editor-info-v2.component';

@NgModule({
  declarations: [
    HomepageComponent,
    EditorsListComponent,
    EditorDetailsComponent,
    EditorDetailComponent,
    EditorInfoComponent,
    ProductsListsComponent,
    ProductsListComponent,
    ProductDetailsComponent,
    AboutsComponent,
    CheckHeaderPipe,
    MakeLinkPipe,
    EditorsListThumbnailComponent,
    EditorSearchBarComponent,
    EditorFiltersComponent,
    EditorItemThumbComponent,
    ScrollPaginationDirective,
    ProductsListThumbnailComponent,
    RemainingEntitiesPipe,
    IsFlagAvailablePipe,
    ProductItemThumbComponent,
    ProductLicensePipe,
    ProductFiltersComponent,
    ProductSearchBarComponent,
    ProductDetailComponent,
    ProductContentComponent,
    TrimTextRangePipe,
    JoinVendorsPipe,
    EditorInfoV2Component,
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    SharedModule,
  ],
})
export class LandingPageModule {}

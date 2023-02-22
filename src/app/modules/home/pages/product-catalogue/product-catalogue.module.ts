import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from 'src/app/material.module';
import { ProductCatalogueRoutingModule } from './product-catalogue-routing.module';
import { EditorListComponent } from './editor/editor-list/editor-list.component';
import { CreateEditorComponent } from './editor/create-editor/create-editor.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '@shared/shared.module';
import { PartnerManagersComponent } from './editor/create-editor/partner-managers/partner-managers.component';
import { AuditsComponent } from './editor/create-editor/audits/audits.component';
import { VendorsComponent } from './editor/create-editor/vendors/vendors.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { HeaderProductCatalogComponent } from './header/header-product-catalog/header-product-catalog.component';
import { GetVersionsPipe } from './pipes/get-versions.pipe';
import { GetOpenSourcePipe } from './pipes/get-open-source.pipe';
import { GetCloseSourcesPipe } from './pipes/get-close-sources.pipe';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { ProductVersionComponent } from './products/create-product/product-version/product-version.component';
import { DeleteConfirmationComponent } from './products/create-product/product-version/dialogs/delete-confirmation/delete-confirmation.component';
import { ProductSupportVendorComponent } from './products/create-product/product-support-vendor/product-support-vendor.component';
import { ProductOpenSourceComponent } from './products/create-product/product-source/product-open-source/product-open-source.component';
import { ProductCloseSourceComponent } from './products/create-product/product-source/product-close-source/product-close-source.component';
import { CloseSourceListComponent } from './products/create-product/product-source/product-close-source/close-source-list/close-source-list.component';
import { ProductSourceComponent } from './products/create-product/product-source/product-source.component';
import { ProductUsefulLinksComponent } from './products/create-product/product-useful-links/product-useful-links.component';
import { ViewProductCatalogProductDialogComponent } from './products/product-list/view-product-catalog-product-dialog/view-product-catalog-product-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DeleteProductConfirmationProductCatalogComponent } from './products/product-list/delete-product-confirmation-product-catalog/delete-product-confirmation-product-catalog.component';
import { EditorViewComponent } from './editor/editor-view/editor-view.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { SuccessFileUploadComponent } from './file-upload/success-file-upload/success-file-upload.component';
import { ActivityLogsComponent } from './file-upload/activity-logs/activity-logs.component';
import { PartnerManagerNamePipe } from './pipes/partner-manager-name.pipe';
import { EditorProductsDialogComponent } from './editor/editor-products-dialog/editor-products-dialog.component';
import { GetVendorsPipe } from './pipes/get-vendors.pipe';
import { MakeLinkPipe } from './pipes/make-link.pipe';
import { SinglePartnerManagerComponent } from './editor/create-editor/partner-managers/single-partner-manager/single-partner-manager.component';
import { PartnerDeletionConfirmationComponent } from './editor/create-editor/partner-managers/single-partner-manager/partner-deletion-confirmation/partner-deletion-confirmation.component';
import { SingleAuditComponent } from './editor/create-editor/audits/single-audit/single-audit.component';
import { AuditDeletionConfirmationComponent } from './editor/create-editor/audits/single-audit/audit-deletion-confirmation/audit-deletion-confirmation.component';

@NgModule({
  declarations: [
    EditorListComponent,
    CreateEditorComponent,
    CreateProductComponent,
    PartnerManagersComponent,
    AuditsComponent,
    VendorsComponent,
    ProductListComponent,
    HeaderProductCatalogComponent,
    GetVersionsPipe,
    GetOpenSourcePipe,
    GetCloseSourcesPipe,
    ProductVersionComponent,
    DeleteConfirmationComponent,
    ProductSupportVendorComponent,
    ProductOpenSourceComponent,
    ProductCloseSourceComponent,
    CloseSourceListComponent,
    ProductSourceComponent,
    ProductUsefulLinksComponent,
    ViewProductCatalogProductDialogComponent,
    EditorListComponent,
    CreateEditorComponent,
    PartnerManagersComponent,
    AuditsComponent,
    VendorsComponent,
    DeleteProductConfirmationProductCatalogComponent,
    EditorViewComponent,
    FileUploadComponent,
    SuccessFileUploadComponent,
    ActivityLogsComponent,
    PartnerManagerNamePipe,
    EditorProductsDialogComponent,
    GetVendorsPipe,
    MakeLinkPipe,
    SinglePartnerManagerComponent,
    PartnerDeletionConfirmationComponent,
    SingleAuditComponent,
    AuditDeletionConfirmationComponent,
  ],
  imports: [
    CommonModule,
    ProductCatalogueRoutingModule,
    SharedModule,
    CustomMaterialModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DIALOG_DATA, useValue: null },
    { provide: MatDialogRef, useValue: null },
  ],
})
export class ProductCatalogueModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataManagementComponent } from './data-management.component';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ListDataComponent } from './list-data/list-data.component';
import { ListMetadataComponent } from './list-metadata/list-metadata.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FailedRecordsDetailsComponent } from './list-data/failed-records-details/failed-records-details.component';
import { ListGlobaldataComponent } from './list-globaldata/list-globaldata.component';
import { ListInventoryLogsComponent } from './list-inventory-logs/list-inventory-logs.component';
import { NominativeUsersComponent } from './nominative-users/nominative-users.component';
import { AddNominativeUserDialogComponent } from './nominative-users/add-nominative-user-dialog/add-nominative-user-dialog.component';
import { AddNominativeUserComponent } from './nominative-users/add-nominative-user/add-nominative-user.component';
import { SingleNominativeUserComponent } from './nominative-users/add-nominative-user/single-nominative-user/single-nominative-user.component';
import { FilterEditorPipe } from './nominative-users/pipes/filter-editor.pipe';
import { FilterProductPipe } from './nominative-users/pipes/filter-product.pipe';
import { FileTypeErrorComponent } from './nominative-users/dialog/file-type-error/file-type-error.component';
import { ConcurrentUsersComponent } from './concurrent-users/concurrent-users.component';
import { AddConcurrentUsersDialogComponent } from './concurrent-users/add-concurrent-users-dialog/add-concurrent-users-dialog.component';
import { AddConcurrentUsersComponent } from './concurrent-users/add-concurrent-users/add-concurrent-users.component';
import { IndividualConcurrentUserComponent } from './concurrent-users/individual-concurrent-user/individual-concurrent-user.component';
import { AggregationConcurrentUserComponent } from './concurrent-users/aggregation-concurrent-user/aggregation-concurrent-user.component';
import { AdminIndividualNominativeUserComponent } from './nominative-users/admin-individual-nominative-user/admin-individual-nominative-user.component';
import { AggregationNominativeUserComponent } from './nominative-users/aggregation-nominative-user/aggregation-nominative-user.component';
import { BrowseFileUploadComponent } from './nominative-users/add-nominative-user/browse-file-upload/browse-file-upload.component';
import { NominativeUserLogComponent } from './nominative-users/nominative-user-log/nominative-user-log.component';
import { FileProcessedComponent } from './nominative-users/add-nominative-user/file-processed/file-processed.component';

@NgModule({
  declarations: [
    DataManagementComponent,
    UploadDataComponent,
    ListDataComponent,
    ListMetadataComponent,
    FailedRecordsDetailsComponent,
    ListGlobaldataComponent,
    ListInventoryLogsComponent,
    NominativeUsersComponent,
    AddNominativeUserDialogComponent,
    AddNominativeUserComponent,
    SingleNominativeUserComponent,
    FilterEditorPipe,
    FilterProductPipe,
    FileTypeErrorComponent,
    ConcurrentUsersComponent,
    AddConcurrentUsersDialogComponent,
    AddConcurrentUsersComponent,
    IndividualConcurrentUserComponent,
    AggregationConcurrentUserComponent,
    AdminIndividualNominativeUserComponent,
    AggregationNominativeUserComponent,
    BrowseFileUploadComponent,
    NominativeUserLogComponent,
    FileProcessedComponent,
  ],
  imports: [
    CommonModule,
    DataManagementRoutingModule,
    CustomMaterialModule,
    TranslateModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class DataManagementModule {}

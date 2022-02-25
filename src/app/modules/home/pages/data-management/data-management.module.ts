import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomMaterialModule } from "src/app/material.module";
import { TranslateModule } from "@ngx-translate/core";
import { DataManagementRoutingModule } from "./data-management-routing.module";
import { DataManagementComponent } from "./data-management.component";
import { UploadDataComponent } from "./upload-data/upload-data.component";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { ListDataComponent } from "./list-data/list-data.component";
import { ListMetadataComponent } from "./list-metadata/list-metadata.component";
import { SharedModule } from "src/app/shared/shared.module";
import { FailedRecordsDetailsComponent } from "./list-data/failed-records-details/failed-records-details.component";
import { ListGlobaldataComponent } from "./list-globaldata/list-globaldata.component";
import { ListInventoryLogsComponent } from "./list-inventory-logs/list-inventory-logs.component";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  declarations: [
    DataManagementComponent,
    UploadDataComponent,
    ListDataComponent,
    ListMetadataComponent,
    FailedRecordsDetailsComponent,
    ListGlobaldataComponent,
    ListInventoryLogsComponent,
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

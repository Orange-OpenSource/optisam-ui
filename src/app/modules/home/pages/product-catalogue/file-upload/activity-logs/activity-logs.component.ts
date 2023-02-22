import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductCatalogService } from '@core/services';
import { CoreFactorService } from '@core/services/core-factor.service';
import { SharedService } from '@shared/shared.service';

@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.scss']
})
export class ActivityLogsComponent implements OnInit,AfterViewInit {

  columns: any = {
    filename: 'File Name',
    uploaded_on: 'Upload On',
  };
  dataSource: MatTableDataSource<any>;
  _loading: boolean = false;

  constructor(private pc:ProductCatalogService ,private coreFactorService:CoreFactorService){}
  ngOnInit() {
    this.getProductCatalogLogs();
  }

  ngAfterViewInit() {}

  get displayedColumns(): string[] {
    return Object.keys(this.columns);
  }
 
 getProductCatalogLogs(): void {
  console.log("l")
    this._loading = true;
    this.pc.getUploadFileLogs().subscribe(
      ({ uploadCatalogDataLogs }: any) => {
        console.log(uploadCatalogDataLogs)
        this.dataSource = new MatTableDataSource<any>(uploadCatalogDataLogs);
        this.pc.setActivityLogVisibility(
          !!uploadCatalogDataLogs?.length
        );
        this._loading = false;
      },
      ({ message }) => {
        if (message) this.pc.setActivityLogError(message);
        this._loading = false;
      },
      () => (this._loading = false)
    );

    // this.coreFactorService.getCoreFactorLogs().subscribe(
    //   ({ corefactorlogs }: any) => {
    //     this.dataSource = new MatTableDataSource<any>(corefactorlogs);
    //     this.coreFactorService.setActivityLogVisibility(
    //       !!corefactorlogs?.length
    //     );
    //     this._loading = false;
    //   },
    //   ({ message }) => {
    //     if (message) this.coreFactorService.setActivityLogError(message);
    //     this._loading = false;
    //   },
    //   () => (this._loading = false)
    // );
  }
}

import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { UploadDataComponent } from '../upload-data/upload-data.component';
import { DataManagementService } from 'src/app/core/services/data-management.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CancelInjectionParams, DefaultResponse, ErrorResponse, GlobalDataListingParams, GlobalDataListingResponse, InjectionData } from '@core/modals';
import { CommonService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';

const INTERVAL_TIME: number = 4000;

@Component({
  selector: 'app-list-globaldata',
  templateUrl: './list-globaldata.component.html',
  styleUrls: ['./list-globaldata.component.scss'],
})
export class ListGlobaldataComponent implements OnInit, OnDestroy, AfterViewInit {
  MyDataSource: MatTableDataSource<InjectionData>;
  displayedColumns: string[] = [
    'file_name',
    'status',
    'uploaded_by',
    'uploaded_on',
    'action',
  ];
  _loading: Boolean = false;
  current_page_num: any = 1;
  page_size: any = 50;
  length: any;
  sortQuery: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  errorMsg: string;
  listInterval: NodeJS.Timeout = null;
  sortingParams: { sort_order: string; sort_by: string; } = {
    sort_order: 'desc',
    sort_by: 'uploaded_on'
  };

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private dataService: DataManagementService,
    private cs: CommonService,
    private ss: SharedService
  ) { }

  ngOnInit(): void {
    this.getListData();
  }

  ngAfterViewInit(): void {
  }

  getStatusInterval(): void {
    if (this.listInterval) clearInterval(this.listInterval);
    this.listInterval = setInterval(() => {
      this.checkStatus();
    }, INTERVAL_TIME)
  }

  private checkStatus(): void {

    const params: GlobalDataListingParams = {
      page_num: this.current_page_num,
      page_size: this.page_size,
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      ...this.sortingParams
    }
    this.dataService.getUploadedGlobalData(params).subscribe((res: GlobalDataListingResponse) => {
      const fileCurrentStatus: string[] = res.uploads.reduce((fileStatus: string[], data: InjectionData) => {
        fileStatus[data.upload_id] = data.status;
        return fileStatus;
      }, [])
      this.MyDataSource.filteredData.map((data: InjectionData) => {
        data.status = fileCurrentStatus[data.upload_id]
      });
    })
  }

  getListData() {
    this._loading = true;
    this.MyDataSource = null;
    const params: GlobalDataListingParams = {
      page_num: this.current_page_num,
      page_size: this.page_size,
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      ...this.sortingParams
    }

    this.dataService.getUploadedGlobalData(params).subscribe(
      (res: GlobalDataListingResponse) => {
        this.MyDataSource = new MatTableDataSource(res.uploads);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
        this.getStatusInterval();
      },
      (err) => {
        console.log('Data details could not be fetched!', err);
        this._loading = false;
      }
    );
  }

  uploadDataFiles() {
    const dialogRef = this.dialog.open(UploadDataComponent, {
      autoFocus: false,
      disableClose: true,
      data: 'Globaldata',
      maxHeight: '90vh',
      width: '420px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.getListData();
    });
  }

  sortData(ev) {
    if (!ev.direction) {
      return false;
    }
    this.sortingParams = {
      sort_order: ev.direction.toLowerCase(),
      sort_by: ev.active == 'file_name' ? 'file_name' : ev.active.toLowerCase()
    }

    this.getListData();
  }

  getPaginatorData(ev) {
    this.current_page_num = ev.pageIndex + 1;
    this.page_size = ev.pageSize;
    this.getListData();
  }

  downloadFile(file, errorMsg) {
    console.log(file);
    // const filePath = file.error_file_api.slice(8);
    this.dataService.getGlobalDataPastInjection(file.upload_id).subscribe(
      (res) => {
        const url = URL.createObjectURL(res);
        const fileName =
          file.file_name;
        const dwldLink: any = document.createElement('a');
        dwldLink.setAttribute('href', url);
        dwldLink.setAttribute('download', fileName);
        dwldLink.style.visibility = 'hidden';
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      },
      (error) => {
        this.errorMsg =
          error.error.message ||
          'Some error occured! Could not download records for selected global file';
        this.openModal(errorMsg);
        console.log('Some error occured! Could not download file.', error);
      }
    );
  }

  downloadFailureReport(file, errorMsg) {
    const filePath = file.error_file_api.slice(8);
    this.dataService.getGlobalDataFailedRecords(filePath).subscribe(
      (res) => {
        const url = URL.createObjectURL(res);
        const fileName =
          file.upload_id +
          '_' +
          file.scope +
          '_error_' +
          file.file_name.slice(0, -4) +
          'xlsx';
        const dwldLink: any = document.createElement('a');
        dwldLink.setAttribute('href', url);
        dwldLink.setAttribute('download', fileName);
        dwldLink.style.visibility = 'hidden';
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      },
      (error) => {
        this.errorMsg =
          error.error.message ||
          'Some error occured! Could not get failed records for selected global file';
        this.openModal(errorMsg);
        console.log('Some error occured! Could not get failed records.', error);
      }
    );
  }

  viewRelatedDataFiles(file) {
    localStorage.setItem('globalFileName', file.file_name);
    this.router.navigate(['/optisam/dm/data', file.upload_id]);
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true,
    });
  }

  cancelInjection(uploadId: number, fileName: string): void {
    const params: CancelInjectionParams = {
      uploadId,
      fileName,
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE)
    }
    this.dataService.cancelInjection(params).subscribe((res: DefaultResponse) => {
      if (res.success) {
        this.ss.commonPopup({
          title: "SUCCESS_TITLE",
          singleButton: true,
          buttonText: "OK",
          message: 'INJECTION_CANCELED_MSG'
        })
      }
    }, (e: ErrorResponse) => {
      this.ss.commonPopup({
        title: "ERROR_TITLE",
        singleButton: true,
        buttonText: "OK",
        message: e.message
      })
    })
  }

  ngOnDestroy(): void {
    if (this.listInterval)
      clearInterval(this.listInterval);
  }
}

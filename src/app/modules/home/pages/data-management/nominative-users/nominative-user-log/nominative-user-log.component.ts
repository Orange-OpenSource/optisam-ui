import { LOCAL_KEYS } from '@core/util/constants/constants';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  TemplateRef,
} from '@angular/core';
import {
  ErrorResponse,
  FileDetail,
  NominativeUserDownloadParams,
  NominativeUserDownloadType,
  NominativeUserFileStatus,
  NominativeUserType,
  ProductType,
  UploadedFiles,
  UploadedFilesParams,
} from '@core/modals';
import { DataManagementService } from 'src/app/core/services/data-management.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService, ProductService } from '@core/services';
import { SharedService } from '@shared/shared.service';

@Component({
  selector: 'app-nominative-user-log',
  templateUrl: './nominative-user-log.component.html',
  styleUrls: ['./nominative-user-log.component.scss'],
})
export class NominativeUserLogComponent implements OnInit {
  @Input() activeTitle: ProductType | 'log';
  dataSource: MatTableDataSource<FileDetail> = new MatTableDataSource([]);
  displayedColumns: string[] = [
    'file_name',
    'file_status',
    'product_editor',
    'name',
    'product_version',
    'type',
    'uploaded_by',
    'uploaded_at',
    'action',
  ];
  currentPageNum: number = 1;
  pageSize: number = 50;
  length: any;
  sortOrder: SortDirection = 'asc';
  sortBy: string = 'name';
  sortQuery: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  errorMsg: string;
  loadingData: boolean = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private dataService: DataManagementService,
    private productService: ProductService,
    private cs: CommonService,
    private ss: SharedService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getListData();
  }

  get statusFailed(): NominativeUserFileStatus {
    return NominativeUserFileStatus.failed;
  }

  get statusCompleted(): NominativeUserFileStatus {
    return NominativeUserFileStatus.completed;
  }

  get statusPartial(): NominativeUserFileStatus {
    return NominativeUserFileStatus.partial;
  }

  get actualDownloadType(): NominativeUserDownloadType {
    return NominativeUserDownloadType.actual;
  }

  get errorDownloadType(): NominativeUserDownloadType {
    return NominativeUserDownloadType.error;
  }

  get params(): UploadedFilesParams {
    return <UploadedFilesParams>{
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      page_num: this.currentPageNum,
      page_size: this.pageSize,
      sort_by: this.sortBy,
      sort_order: this.sortOrder
    };
  }


  getListData() {
    this.dataSource = new MatTableDataSource([]);
    this.loadingData = true;

    this.productService.getUploadedFiles(this.params).subscribe(
      (res: UploadedFiles) => {
        this.loadingData = false;
        this.dataSource = new MatTableDataSource(res.file_details);
        this.length = res.total;
        this.cd.markForCheck();
      },
      (e: ErrorResponse) => {
        this.loadingData = false;
        this.ss.commonPopup({
          title: 'ERROR',
          message: e.message,
          singleButton: true,
          buttonText: 'OK',
        });
        this.cd.markForCheck();
      }
    );
  }

  getPaginatorData(ev) {
    this.currentPageNum = ev.pageIndex + 1;
    this.pageSize = ev.pageSize;
    this.getListData();
  }

  sortChange(e: Sort): void {
    this.sortBy = e.active;
    this.sortOrder = e.direction;
    this.currentPageNum = 1;
    this.getListData();

  }

  downloadFile(file: FileDetail, type: NominativeUserDownloadType) {
    const { id, file_name } = file;
    const status: string = type === NominativeUserDownloadType.actual ? 'downloadingStatus' : 'errorFileDownloadingStatus';
    file[status] = true;
    const params: NominativeUserDownloadParams = {
      id,
      type,
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
    };
    this.dataService.getNominativeUserFileData(params).subscribe(
      (res: any) => {
        file[status] = false;
        const prefix: string =
          type === NominativeUserDownloadType.error ? 'Error_' : '';
        const url = URL.createObjectURL(res);
        const link: HTMLAnchorElement = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', prefix + file_name);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.cd.markForCheck();
      },
      (e: any) => {
        file[status] = false;
        this.ss.commonPopup({
          title: 'NOMINATIVE_USER.TITLE.ERROR',
          buttonText: 'OK',
          singleButton: true,
          message: e?.message || 'DOWNLOAD_ERROR',
        });
        this.cd.markForCheck();
      }
    );
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
      width: '30%',
      disableClose: true,
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadDataComponent } from '../upload-data/upload-data.component';
import { DataManagementService } from 'src/app/core/services/data-management.service';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FailedRecordsDetailsComponent } from './failed-records-details/failed-records-details.component';
import { ActivatedRoute } from '@angular/router';
import { allowedScopes } from '@core/util/common.functions';

@Component({
  selector: 'app-list-data',
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.scss'],
})
export class ListDataComponent implements OnInit {
  subscription: Subscription;
  MyDataSource: any;
  displayedColumns: string[] = [
    'file_name',
    'status',
    'uploaded_by',
    'uploaded_on',
    'total_records',
    'success_records',
    'failed_records',
    'comments',
  ];
  _loading: Boolean = false;
  current_page_num: any = 1;
  page_size: any = 50;
  length: any;
  sortQuery: any;
  globalFileId: string;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private dataService: DataManagementService
  ) {
    if (route.snapshot.params['globalFileId']) {
      this.globalFileId = route.snapshot.params['globalFileId'];
    }
  }

  ngOnInit() {
    this.getListData();
  }

  getListData() {
    this._loading = true;
    this.MyDataSource = null;
    let query =
      '?page_num=' + this.current_page_num + '&page_size=' + this.page_size;
    this.sortQuery = this.sortQuery
      ? this.sortQuery
      : '&sort_order=desc&sort_by=uploaded_on';
    query += this.sortQuery;
    this.subscription = this.dataService
      .getUploadedData(query, this.globalFileId)
      .subscribe(
        (res) => {
          this.MyDataSource = new MatTableDataSource(res.uploads);
          this.MyDataSource.sort = this.sort;
          this.length = res.totalRecords;
          this._loading = false;
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
      data: 'Data',
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
    this.sortQuery = '&sort_order=' + ev.direction.toLowerCase() + '&sort_by=';
    switch (ev.active) {
      case 'file_name':
        this.sortQuery += 'file_name';
        break;

      default:
        this.sortQuery += ev.active.toLowerCase();
        break;
    }
    this.getListData();
  }

  getPaginatorData(ev) {
    this.current_page_num = ev.pageIndex + 1;
    this.page_size = ev.pageSize;
    this.getListData();
  }

  failedRecords(upload_id) {
    this.dialog.open(FailedRecordsDetailsComponent, {
      autoFocus: false,
      disableClose: true,
      data: { upload_id: upload_id },
      maxHeight: '95vh',
      width: '70vw',
    });
  }

  get allowedScope(): boolean {
    return allowedScopes();
  }
}

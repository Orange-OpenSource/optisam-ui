import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadDataComponent } from '../upload-data/upload-data.component';
import { DataManagementService } from 'src/app/core/services/data-management.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-globaldata',
  templateUrl: './list-globaldata.component.html',
  styleUrls: ['./list-globaldata.component.scss'],
})
export class ListGlobaldataComponent implements OnInit {
  MyDataSource: any;
  displayedColumns: string[] = [
    'file_name',
    'status',
    'uploaded_by',
    'uploaded_on',
  ];
  _loading: Boolean = false;
  current_page_num: any = 1;
  page_size: any = 50;
  length: any;
  sortQuery: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  errorMsg: string;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private dataService: DataManagementService
  ) {}

  ngOnInit(): void {
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

    this.dataService.getUploadedGlobalData(query).subscribe(
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
}

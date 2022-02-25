import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ReportService } from 'src/app/core/services/report.service';
import { CreateReportComponent } from '../create-report/create-report.component';

@Component({
  selector: 'app-list-reports',
  templateUrl: './list-reports.component.html',
  styleUrls: ['./list-reports.component.scss'],
})
export class ListReportsComponent implements OnInit {
  subscription: Subscription;
  MyDataSource: any;
  displayedColumns: string[] = [
    'report_id',
    'report_type',
    'created_on',
    'created_by',
    'report_status',
    'actions',
  ];
  _loading: Boolean = false;
  current_page_num: any = 1;
  page_size: any = 50;
  length: any;
  sortQuery: any;
  selectedFileFormat: any;
  selectedReportID: any;
  selectedReportType: any;
  isDownloading: Boolean;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor(
    private dialog: MatDialog,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.getReportsData();
  }

  getReportsData() {
    this._loading = true;
    this.MyDataSource = null;
    let query =
      '?page_num=' + this.current_page_num + '&page_size=' + this.page_size;
    this.sortQuery = this.sortQuery
      ? this.sortQuery
      : '&sort_order=desc&sort_by=created_on';
    query += this.sortQuery;
    this.subscription = this.reportService.getListOfReports(query).subscribe(
      (res) => {
        this.MyDataSource = new MatTableDataSource(res.reports);
        this.MyDataSource.sort = this.sort;
        this.length = res.totalRecords;
        this._loading = false;
      },
      (err) => {
        console.log('Report details could not be fetched!', err);
        this._loading = false;
      }
    );
  }

  createReport() {
    const dialogRef = this.dialog.open(CreateReportComponent, {
      autoFocus: false,
      disableClose: true,
      data: 'Data',
      maxHeight: '500px',
      width: '650px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getReportsData();
    });
  }

  setFileFormat(value, report, confirmMsg) {
    this.selectedReportID = report.report_id;
    this.selectedReportType = report.report_type;
    this.selectedFileFormat = value;
    this.openModal(confirmMsg, '40%');
  }

  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }

  getReportById(successMsg, errorMsg) {
    this.isDownloading = true;
    this.reportService.getReportById(this.selectedReportID).subscribe(
      (res) => {
        let decodedReportData: any = atob(res.report_data);
        const dataInJSONFormat = JSON.parse(decodedReportData);
        let reportContents = [];
        reportContents = dataInJSONFormat;
        var headerList = [];
        for (var k in reportContents[0]) headerList.push(k);
        this.reportService.downloadFile(
          reportContents,
          headerList,
          'Report_' + this.selectedReportType + '_' + this.selectedReportID,
          this.selectedFileFormat
        );
        this.dialog.closeAll();
        this.isDownloading = false;
      },
      (err) => {
        this.dialog.closeAll();
        this.openModal(errorMsg, '30%');
        this.isDownloading = false;
        console.log('Some error occured! Could not fetch report details.');
      }
    );
  }

  sortData(ev) {
    if (!ev.direction) {
      return false;
    }
    this.sortQuery =
      '&sort_order=' +
      ev.direction.toLowerCase() +
      '&sort_by=' +
      ev.active.toLowerCase();
    this.getReportsData();
  }

  getPaginatorData(ev) {
    this.current_page_num = ev.pageIndex + 1;
    this.page_size = ev.pageSize;
    this.getReportsData();
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReportByIdResponse, ReportMetaData } from '@core/modals';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';
import { ReportService } from 'src/app/core/services/report.service';
import { CreateReportComponent } from '../create-report/create-report.component';
import { REPORT_TRANSLATIONS } from '@core/util/constants/constants';
import { FrenchNumberPipe } from '@shared/common-pipes/french-number.pipe';


@Component({
  selector: 'app-list-reports',
  templateUrl: './list-reports.component.html',
  styleUrls: ['./list-reports.component.scss'],
  providers: [FrenchNumberPipe]
})
export class ListReportsComponent implements OnInit {
  subscription: Subscription;
  MyDataSource: any;
  displayedColumns: string[] = [
    'report_id',
    'report_type',
    'created_on',
    'created_by',
    'editor',
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
    private reportService: ReportService,
    private numberFr: FrenchNumberPipe
  ) { }

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
      (res: ReportByIdResponse) => {
        let decodedReportData: any = atob(res.report_data);
        // export

        let editor: string = '';
        let equipmentType: string = '';
        let isExpensesByEditor: boolean = false;
        let isProductEquipments: boolean = false;

        let customExclusionByType: string[] = ['editor'];
        switch (this.selectedReportType) {
          case 'Expenses by Editor':
            customExclusionByType = [];
            isExpensesByEditor = true;
            break;
          case 'ProductEquipments':
            isProductEquipments = true;
            break;

        }
        const excludeHeader: string[] = [
          'swidtags',
          'swidtag',
          ...customExclusionByType,
        ];
        const dataInJSONFormat = JSON.parse(decodedReportData).map((d: any, i: number) => {
          if (d?.editor && !isExpensesByEditor && i == 0) editor = d.editor;
          // if (isProductEquipments && i == 0) equipmentType = this.getEquipmentTypeFromData(d);
          for (const exclude of excludeHeader)
            if (exclude in d) delete d[exclude];
          return d;
        });
        const metaData: ReportMetaData = {
          reportType: res.report_type,
          scope: res.scope,
          editor,
          equipmentType: res.equip_type,
          createdOn: format(new Date(res.created_on), 'yyyy-MM-dd'),
          createdBy: res.created_by,
        };
        let reportContents = [];
        reportContents = dataInJSONFormat;
        var headerList = [];
        for (var k in reportContents[0]) headerList.push(k);
        const translations = REPORT_TRANSLATIONS;
        this.reportService.downloadFile({
          data: reportContents,
          headerList,
          filename:
            'Report_' + this.selectedReportType + '_' + this.selectedReportID,
          formatType: this.selectedFileFormat,
          metaData,
          translations,
        });
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

  private getEquipmentTypeFromData(data: any): string {
    let equipmentType: string = '';
    switch (true) {
      case !!data?.server_id:
        equipmentType = 'Server'
        break;
      case !!data?.softpartition_id:
        equipmentType = 'Softpartition'
        break;
      case !!data?.cluster_name:
        equipmentType = 'Cluster'
        break;
      case !!data?.vcenter_name:
        equipmentType = 'VCenter'
        break;
    }

    return equipmentType;
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}

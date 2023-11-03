import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DefaultResponse, ErrorResponse, ImportMetricsParams, MetricType, MetricTypeResponse } from '@core/modals';
import { CommonService, MetricService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { SharedService } from '@shared/shared.service';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-import-metrics',
  templateUrl: './import-metrics.component.html',
  styleUrls: ['./import-metrics.component.scss']
})
export class ImportMetricsComponent implements OnInit {
  @ViewChild('selectAll') selectAllEl: ElementRef;
  @ViewChildren('checkBox') checkBoxEls: QueryList<MatCheckbox>;
  selectedMetricList: string[] = [];
  displayedColumns: string[] = ['all', 'metricName'];
  metricTypeList: MatTableDataSource<MetricType>;
  _loading: boolean = false;
  isPostingMetrics: boolean = false;
  refreshTable: boolean = false;
  selectAllFlag: boolean = false;

  constructor(private ms: MetricService, private cs: CommonService, private ss: SharedService, private dialogRef: MatDialogRef<ImportMetricsComponent>, private cd: ChangeDetectorRef) { }



  ngOnInit(): void {
    this.getMetricTypeList();
  }

  get allDisabled(): boolean {
    return false;
  }

  get allActiveChecked(): boolean {
    if (!this.checkBoxEls) return false;
    let allActiveChecked: boolean = true;
    this.checkBoxEls.forEach((checkbox: MatCheckbox) => {
      if (checkbox.disabled) return;
      if (!checkbox.checked) {
        allActiveChecked = false;
      }
    })
    return allActiveChecked;
  }

  changeAll(isChecked: boolean): void {
    if (!isChecked) {
      this.selectedMetricList = [];
      return;
    }

    this.checkBoxEls.forEach((checkbox: MatCheckbox) => {
      if (!checkbox.disabled) {
        const metricType: string = checkbox._elementRef.nativeElement.getAttribute('data-name');
        this.selectedMetricList.push(metricType);
      }
    })
  }

  private getMetricTypeList(): void {
    const scope: string = this.cs.getLocalData(LOCAL_KEYS.SCOPE);
    this._loading = true;
    this.ms.getMetricType(scope, true).subscribe(({ types }: MetricTypeResponse) => {
      this._loading = false;
      types = this.cs.customSort(types, 'asc', 'name');
      this.metricTypeList = new MatTableDataSource(types || []);
    }, (e: ErrorResponse) => {
      this._loading = false;
      this.ss.commonPopup({
        title: "ERROR_TITLE",
        singleButton: true,
        buttonText: "OK",
        message: e.message
      })
    })
  }

  selectedMetricTypeList(checkBox: MatCheckbox, metricType: MetricType): void {
    if (checkBox.checked) {
      !metricType?.is_exist && this.selectedMetricList.push(metricType.name);
      this.selectedMetricList = [...new Set(this.selectedMetricList)]
      console.log(this.selectedMetricList);
      return;
    }
    this.selectedMetricList = this.selectedMetricList.filter((type: string) => metricType.name !== type)
    this.selectedMetricList = [...new Set(this.selectedMetricList)]
  }

  submitImport(): void {
    if(this.isPostingMetrics) return;
    this.refreshTable = true;
    const body: ImportMetricsParams = {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      metric: this.selectedMetricList
    }
    this.isPostingMetrics = true;
    this.ms.importMetrics(body).subscribe((res: DefaultResponse) => {
      this.isPostingMetrics = false;
      if (res.success) {
        this.ss.commonPopup({
          title: "SUCCESS_TITLE",
          singleButton: true,
          buttonText: "OK",
          message: "SUCCESS_METRIC_IMPORT"
        }).afterClosed().subscribe(() => {
          this.dialogRef.close(true);
        })
      }
    }, (e: ErrorResponse) => {
      this.isPostingMetrics = false;
      this.ss.commonPopup({
        title: "ERROR_TITLE",
        singleButton: true,
        buttonText: "OK",
        message: e.message
      })
    })
  }

}

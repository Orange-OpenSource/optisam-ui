import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MetricDetailsComponent } from '../metric-details/metric-details.component';
import { MetricService } from 'src/app/core/services/metric.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreateMetricComponent } from '../create-metric/create-metric.component';
import { Metric } from '@core/modals';
import { EditMetricsComponent } from '../edit-metrics/edit-metrics.component';

@Component({
  selector: 'app-metric-view',
  templateUrl: './metric-view.component.html',
  styleUrls: ['./metric-view.component.scss'],
})
export class MetricViewComponent implements OnInit, AfterViewInit {
  displayedColumns = ['type', 'name', 'description'];
  index: number;
  id: string;
  equipment_types = [];
  role: String;
  _loading: Boolean;
  MyDataSource: MatTableDataSource<{}>;
  noDataAvailableFlag: Boolean;
  metricToDelete: any;
  errorMessage: string;
  _deleteLoading: Boolean;

  constructor(public metricService: MetricService, public dialog: MatDialog) {}

  ngOnInit() {
    this.role = localStorage.getItem('role');
    if (this.role === 'ADMIN' || this.role === 'SUPER_ADMIN') {
      this.displayedColumns.push('action');
    }
    this.loadData();
  }

  ngAfterViewInit(): void {}

  addNew() {
    const dialogRef = this.dialog.open(CreateMetricComponent, {
      width: '800px',
      minHeight: '250px',
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.loadData();
    });
  }

  openDetails(metric: Metric): void {
    this.dialog.open(MetricDetailsComponent, {
      width: '800px',
      disableClose: true,
      autoFocus: false,
      maxHeight: '90vh',
      data: metric,
    });
  }

  loadData() {
    this._loading = true;
    this.metricService.getMetricList().subscribe(
      (res: any) => {
        this.MyDataSource = new MatTableDataSource(res.metrices);
        if (this.MyDataSource.data.length == 0) {
          this.noDataAvailableFlag = true;
        } else {
          this.noDataAvailableFlag = false;
        }
        this._loading = false;
      },
      (error) => {
        if (error.error == 'cannot fetch metric types') {
          this.noDataAvailableFlag = true;
        } else {
          this.noDataAvailableFlag = false;
        }
        this._loading = false;
        console.log('There was an error while retrieving Posts !!!' + error);
      }
    );
  }

  deleteMetricConfirmation(metric, templateRef) {
    this.metricToDelete = metric;
    this.openModal(templateRef, '40%');
  }

  deleteMetric(successMsg, errorMsg) {
    this._deleteLoading = true;
    this.metricService.deleteMetric(this.metricToDelete.name).subscribe(
      (res) => {
        this._deleteLoading = false;
        this.dialog.closeAll();
        this.openModal(successMsg, '30%');
        console.log('Successfully Deleted! ', this.metricToDelete.name);
      },
      (error) => {
        this._deleteLoading = false;
        this.dialog.closeAll();
        this.errorMessage =
          error.error.message || 'Some error occured! Could not delete metric';
        this.openModal(errorMsg, '30%');
        console.log('Error occured while deleting metric!', error);
      }
    );
  }

  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }

  editMetrics(metric: Metric): void {
    this.dialog.open(EditMetricsComponent, {
      width: '800px',
      disableClose: true,
      autoFocus: false,
      maxHeight: '90vh',
      data: { metric },
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}

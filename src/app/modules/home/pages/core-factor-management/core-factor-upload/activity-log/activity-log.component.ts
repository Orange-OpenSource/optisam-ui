import {
  AfterViewInit,
  Component,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CoreFactorService } from '@core/services/core-factor.service';
import {
  ActivityLogResponse,
  ActivityLog,
} from '@home/pages/core-factor-management/core-factor.modal';
import { SharedService } from '@shared/shared.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent implements OnInit, AfterViewInit {
  columns: any = {
    filename: 'File Name',
    uploaded_on: 'Upload On',
  };
  dataSource: MatTableDataSource<ActivityLog>;
  _loading: boolean = false;

  constructor(
    private coreFactorService: CoreFactorService,
    private sharedService: SharedService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.getCoreFactorLogs();
  }

  ngAfterViewInit() {}

  get displayedColumns(): string[] {
    return Object.keys(this.columns);
  }

  getCoreFactorLogs(): void {
    this._loading = true;
    this.coreFactorService.getCoreFactorLogs().subscribe(
      ({ corefactorlogs }: ActivityLogResponse) => {
        this.dataSource = new MatTableDataSource<ActivityLog>(corefactorlogs);
        this.coreFactorService.setActivityLogVisibility(
          !!corefactorlogs?.length
        );
        this._loading = false;
      },
      ({ message }) => {
        if (message) this.coreFactorService.setActivityLogError(message);
        this._loading = false;
      },
      () => (this._loading = false)
    );
  }
}

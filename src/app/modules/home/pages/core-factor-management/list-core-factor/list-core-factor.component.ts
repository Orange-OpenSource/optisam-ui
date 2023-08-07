import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreFactorService } from '@core/services/core-factor.service';
import { Subscription, Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
  CoreFactorListGetParam,
  CoreFactorListResponse,
  CoreFactorListData,
} from '../core-factor.modal';
import { CoreFactorUploadComponent } from '../core-factor-upload/core-factor-upload.component';
import { SharedService } from '@shared/shared.service';
import { CommonService } from '@core/services/common.service';

@Component({
  selector: 'app-list-core-factor',
  templateUrl: './list-core-factor.component.html',
  styleUrls: ['./list-core-factor.component.scss'],
})
export class ListCoreFactorComponent implements OnInit, AfterViewInit {
  displayedColumns: object = {
    manufacturer: 'Manufacturer',
    model: 'Model',
    corefactor: 'Core Factor',
  };
  dataSource: any;
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLInputElement>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize: number = 50;
  currentPage: number = 1;
  paginationLength: number = 0;
  isLoading$: Observable<Boolean>;

  constructor(
    private coreFactorService: CoreFactorService,
    public dialog: MatDialog,
    private sharedService: SharedService,
    private cs: CommonService
  ) {}

  ngOnInit() {
    this.isLoading$ = this.sharedService.httpLoading();
    this.getCoreFactorList();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) this.dataSource.paginator = this.paginator;
  }

  get columnOriginal(): string[] {
    return Object.keys(this.displayedColumns);
  }

  getCoreFactorList(): void {
    const param: CoreFactorListGetParam = {
      pageNo: this.currentPage,
      pageSize: this.pageSize,
    };
    this.coreFactorService.getCoreFactorList(param).subscribe(
      ({ references, totalRecord }: CoreFactorListResponse) => {
        this.paginationLength = totalRecord;
        this.dataSource = new MatTableDataSource(
          this.cs.customSort(references, 'asc', [
            'manufacturer',
            'model',
            'corefactor',
          ])
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openFileUploadPopup(): void {
    let dialogRef = this.dialog.open(CoreFactorUploadComponent, {
      minHeight: '400px',
      maxHeight: '70vh',
      width: '480px',
      disableClose: true,
      panelClass: ['ps', 'scroll-container'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getCoreFactorList();
    });
  }

  getPaginatorData(ev: any): void {
    this.pageSize = ev.pageSize;
    this.currentPage = ev.pageIndex + 1;
    this.getCoreFactorList();
  }
}

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { EditAggregationDialogComponent } from '../edit-aggregation-dialog/edit-aggregation-dialog.component';
import { CreateAggregationComponent } from '../create-aggregation/create-aggregation.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';
import {
  AggregationGetResponse,
  AggregationSingle,
  GetAggregationParams,
} from '@core/modals';
import { CommonService } from '@core/services/common.service';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { MatTableDataSource } from '@angular/material/table';
import { ViewEditorDetailsAggComponent } from '../view-editor-details-agg/view-editor-details-agg.component';

@Component({
  selector: 'app-list-aggregation',
  templateUrl: './list-aggregation.component.html',
  styleUrls: ['./list-aggregation.component.scss'],
})
export class ListAggregationComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  aggregationData: MatTableDataSource<AggregationSingle>;
  displayedColumns: string[];
  totalRecords: number;
  pageSize: number = 50;
  pageSizeOptions: number[] = [50, 100, 200];
  currentPageNum: number = 1;
  advanceSearchModel: any = {
    title: 'Search by Aggregation Name',
    primary: 'name',
    other: [{ key: 'name', label: 'Aggregation Name' }],
  };
  role: string;
  _loading: Boolean;
  selectedAggregation: any;
  adminRoles: string[] = ['ADMIN', 'SUPER_ADMIN'];
  sortBy: string = 'aggregation_name';
  sortOrder: 'asc' | 'desc' = 'asc';
  length: any;
  pageEvent: any;
  dialogRef: any;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private cs: CommonService
  ) {}

  ngOnInit() {
    this.role = this.cs.getLocalData(LOCAL_KEYS.ROLE);

    this.displayedColumns = [
      'name',
      'product_names',
      'editor',
      'numofSwidTags',
      ...(this.adminRoles.includes(this.role) ? ['action'] : []),
    ];
    this.dialog.afterAllClosed.subscribe((res) => this.getAggregations());
    this.getAggregations();
  }

  ngAfterViewInit(): void {
    // console.log('paginator', this.paginator);
    // this.aggregationData.paginator = this.paginator;
    // console.log(this.aggregationData);
  }

  getAggregations() {
    this._loading = true;
    const param: GetAggregationParams = {
      scope: this.cs.getLocalData(LOCAL_KEYS.SCOPE),
      page_size: this.pageSize,
      page_num: this.currentPageNum,
      sort_by: this.sortBy,
      sort_order: this.sortOrder,
    };
    this.productService.getAggregations(param).subscribe(
      (data: AggregationGetResponse) => {
        this.aggregationData = new MatTableDataSource(data.aggregations);
        this.length = data.total_records;
        this._loading = false;
      },
      (error) => {
        console.log(
          'There was an error while retrieving aggregations !!!' + error
        );
      }
    );
  }

  advSearchTrigger(ev: any) {
    console.log('trigger =>', ev);
  }

  sortData(ev: any) {
    console.log('sort =>', ev);
  }

  getPaginatorData(ev) {
    this.pageSize = ev.pageSize;
    this.currentPageNum = ev.pageIndex + 1;
    this.getAggregations();
  }
  openModal(templateRef, width) {
    let dialogRef = this.dialog.open(templateRef, {
      width: width,
      disableClose: true,
    });
  }

  deleteAggregationConfirmation(aggregate: any, deleteConfirmation) {
    this.selectedAggregation = aggregate;
    this.openModal(deleteConfirmation, '40%');
  }

  deleteAggregation(aggregate: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: {
        title: 'Delete Aggregation',
        content: 'Are you sure you want to delete ' + aggregate.name,
        type: 'deleteProductAggregate',
        id: aggregate.ID,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAggregations();
      }
    });
  }

  deleteProductAggregation(successMsg, errorMsg) {
    this.productService
      .deleteAggregation(this.selectedAggregation.ID)
      .subscribe(
        (resp) => {
          this._loading = false;
          this.openModal(successMsg, '30%');
        },
        (err) => {
          this._loading = false;
          this.openModal(errorMsg, '30%');
        }
      );
  }

  editAggregation(aggregation: any) {
    const dialogRef = this.dialog.open(EditAggregationDialogComponent, {
      width: '45vw',
      autoFocus: false,
      disableClose: true,
      data: aggregation,
      maxHeight: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAggregations();
      }
    });
  }

  openEditorDialog(data: any) {
    this.dialogRef = this.dialog.open(ViewEditorDetailsAggComponent, {
      width: '1300px',
      disableClose: true,
      data: data,
    });

    this.dialogRef.afterClosed().subscribe((result) => {});
  }

  addNew() {
    const dialogRef = this.dialog.open(CreateAggregationComponent, {
      width: '45vw',
      disableClose: true,
      maxHeight: '600px',
    });
  }
}

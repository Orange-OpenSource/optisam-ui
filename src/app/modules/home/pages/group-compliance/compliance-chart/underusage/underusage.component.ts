import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ProductService } from '@core/services';
import {
  ComplianceUnderUsage,
  UnderUsageComplianceParams,
} from '@core/services/underusage-compliance';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { PaginationEvent } from '@core/modals';

@Component({
  selector: 'app-underusage',
  templateUrl: './underusage.component.html',
  styleUrls: ['./underusage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnderusageComponent implements OnInit, OnChanges {
  @Input() selectedScopeCodes: string[];
  @Input() editor: string = null;
  displayedColumns: string[] = [];
  underUsageDataSource: any[] = [];
  displayData: boolean = false;
  length: number = 0;
  currentPageNum: number = 1;
  pageSizeOptions: number[] = [50, 100, 150];
  pageSize: number = this.pageSizeOptions[0];
  sortBy: string = 'metrics';
  sortOrder: string = 'asc';
  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('editor' in changes) {
      this.getUnderUsageComplianceList();
    }
  }
  ngOnInit(): void {
    // console.log('working');
    this.displayedColumns = ['scope', 'product_name', 'metrics', 'delta_number'];
    this.underUsageDataSource = [];
    this.getUnderUsageComplianceList();
  }

  selectionChanged(ev: any, data: string[]) {
    if (ev === 'clear') {
      this.reset();
    } 
  }

  getUnderUsageComplianceList(selectedScopeCodes?: string[]): void {
    this.reset();
    if (!this.editor) return;
    const underUsageParams: UnderUsageComplianceParams = {
      scopes: this.selectedScopeCodes,
      ...this.getFilters,
    };
    this.productService
      .getUnderUsageCompliance(underUsageParams)
      .subscribe((res: ComplianceUnderUsage) => {
        this.displayData = true;
        this.underUsageDataSource = res.UnderusageByEditorData;
        this.cdr.detectChanges();
      });
  }

  reset() {
    this.underUsageDataSource = [];
    this.displayData = false;
    this.cdr.detectChanges();
  }

  getPaginatorData(event: PaginationEvent) {
    this.currentPageNum = +event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getUnderUsageComplianceList();
  }

  get getFilters() {
    return {
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      editor: this.editor,
    };
  }
}

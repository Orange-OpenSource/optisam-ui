import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export class PaginatorI18n {

  constructor(private readonly translate: TranslateService) {}

  getPaginatorIntl(): MatPaginatorIntl {
      const paginatorIntl = new MatPaginatorIntl();
      this.translate.stream('ITEMS_PER_PAGE_LABEL').subscribe((value=>{paginatorIntl.itemsPerPageLabel = value}));
      this.translate.stream('NEXT_PAGE_LABEL').subscribe((value=>{paginatorIntl.nextPageLabel = value}));
      this.translate.stream('PREVIOUS_PAGE_LABEL').subscribe((value=>{paginatorIntl.previousPageLabel = value}));
      this.translate.stream('FIRST_PAGE_LABEL').subscribe((value=>{paginatorIntl.firstPageLabel = value}));
      this.translate.stream('LAST_PAGE_LABEL').subscribe((value=>{paginatorIntl.lastPageLabel = value}));
      paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);
      return paginatorIntl;
  }

  private getRangeLabel(page: number, pageSize: number, length: number): string {
      if (length === 0 || pageSize === 0) {
          return this.translate.instant('RANGE_PAGE_LABEL_1', { length });
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return this.translate.instant('RANGE_PAGE_LABEL_2', { startIndex: startIndex + 1, endIndex, length });
  }
}
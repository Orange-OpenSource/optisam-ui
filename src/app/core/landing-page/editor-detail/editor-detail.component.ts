import { Component, Input, OnInit } from '@angular/core';
import {
  ErrorResponse,
  ProductCatalogEditor,
  ProductCatalogProduct,
  ProductCatalogProductListParams,
  ProductCatalogProductsListResponse,
  TableSortOrder,
} from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editor-detail',
  templateUrl: './editor-detail.component.html',
  styleUrls: ['./editor-detail.component.scss'],
})
export class EditorDetailComponent implements OnInit {
  @Input('data') editorDetails: ProductCatalogEditor;
  ngOnInit(): void {
    console.log('editorDetails', this.editorDetails);
  }

  constructor() {}
}

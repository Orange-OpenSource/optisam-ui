import {
  Component,
  OnChanges,
  SimpleChanges,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { AuditHeader, PartnerManagerHeader } from '@core/modals';
import { ProductCatalogService } from '@core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editor-details',
  templateUrl: './editor-details.component.html',
  styleUrls: ['./editor-details.component.scss'],
})
export class EditorDetailsComponent implements OnChanges, OnInit, OnDestroy {
  @Input() editorId: string = '';
  editorDetails: any;
  _loading: boolean = false;
  displayedColumns = ['name', 'email'];
  displayedColumns2 = ['entity', 'date'];
  displayedColumns3 = ['name'];
  scopes: any;
  version: any;
  partnerManager: any;
  partnerManagerName: any;
  partnerManagerEmail: any;
  entity: any;
  auditsDate: any;
  isEditorAvailable: boolean = false;
  $getEditorById: Subscription;

  partnerManagerHeaders: PartnerManagerHeader[] = [
    { key: 'name', header: 'Name', translation: '' },
    { key: 'email', header: 'Email', translation: '' },
  ];

  auditHeaders: AuditHeader[] = [
    { key: 'entity', header: 'Audit Text', translation: '' },
    { key: 'date', header: 'Audit Year', translation: '' },
  ];

  constructor(private productCatalogService: ProductCatalogService) {}
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editorId != '') {
      this.loadData();
    }
  }

  get isEditorId(): boolean {
    return !!this.editorId;
  }

  loadData(): void {
    this._loading = true;
    this.$getEditorById = this.productCatalogService
      .getEditorById(this.editorId)
      .subscribe(
        (response) => {
          this.editorDetails = response;
          this._loading = false;
        },
        (error) => {
          this.editorId = '';
          this._loading = false;
        }
      );
  }

  get partnerManagerTableHeaders(): string[] {
    return this.partnerManagerHeaders.map((pm: PartnerManagerHeader) => pm.key);
  }
  get auditTableHeaders(): string[] {
    return this.auditHeaders.map((pm: AuditHeader) => pm.key);
  }

  ngOnDestroy(): void {
    this.$getEditorById?.unsubscribe();
  }
}

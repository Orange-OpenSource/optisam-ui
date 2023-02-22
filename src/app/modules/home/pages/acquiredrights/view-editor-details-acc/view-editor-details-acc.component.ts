import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductCatalogService } from '@core/services';

@Component({
  selector: 'app-view-editor-details-acc',
  templateUrl: './view-editor-details-acc.component.html',
  styleUrls: ['./view-editor-details-acc.component.scss'],
})
export class ViewEditorDetailsAccComponent implements OnInit {
  id: string;
  _loading: boolean = true;
  length: any;
  editorDetails: any;
  partnerManagers: string[];
  vendors: any;
  audits: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public pc: ProductCatalogService
  ) {}

  ngOnInit(): void {
    this.id = this.data?.editor_id;
    this.getEditorData();
  }

  getEditorData() {
    this.pc.getEditorById(this.id).subscribe(
      (res: any) => {
        this._loading = false;
        this.editorDetails = res;
        this.partnerManagers = this.editorDetails?.partner_managers?.map(
          (x: any) => x.name
        );
        this.vendors = this.editorDetails?.vendors?.map((y: any) => y.name);
        this.audits = this.editorDetails?.audits?.map((z: any) => z.date) || [];
        this.length = res.totalrecords;
      },
      (error) => {
        console.log(error);
        this._loading = false;
      }
    );
  }
}

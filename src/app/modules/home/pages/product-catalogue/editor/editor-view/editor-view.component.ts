import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as COUNTRY_CODES from '@assets/files/country_code.json';

@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss'],
})
export class EditorViewComponent implements OnInit {
  _loading = false;
  audits: any;
  partnerManagers: any;
  vendors: any;
  country: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.audits = this.data?.audits?.map((x) => x.entity);
    this.partnerManagers = this.data?.partner_managers?.map((x) => x.name);
    this.vendors = this.data?.vendors?.map((x) => x.name);
    this.country = COUNTRY_CODES?.['default'][this.data?.country_code];
    console.log(this.country);
  }
}

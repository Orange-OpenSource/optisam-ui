import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AboutData, AboutFuture } from '@core/modals';
import { CommonService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';

@Component({
  selector: 'app-abouts',
  templateUrl: './abouts.component.html',
  styleUrls: ['./abouts.component.scss']
})
export class AboutsComponent implements OnInit {

  releaseNotes: any;
  futures2021: any;
  futures2022: any;
  version: string;
  copyright: string;
  future: AboutFuture[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AboutData,
    private cs: CommonService
  ) {
    this.version = this.cs.getLocalData(LOCAL_KEYS.VERSION) || '';
    this.copyright = this.data?.copyright || 'NA';
  }

  ngOnInit(): void {
    this.releaseNotes = this.data?.release_notes;
    this.future = this.data?.future;
  }

}

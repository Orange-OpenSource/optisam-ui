import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  releaseNotes:any;
  futures2021:any;
  futures2022:any;
  version:string;
  copyright:string

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.version = localStorage.getItem('version');
    this.copyright = localStorage.getItem('copyright')==='undefined'?'NA':localStorage.getItem('copyright');
  }

  ngOnInit(): void {
    this.releaseNotes = this.data['releaseNotes']?this.data['releaseNotes'].split(','):[];
    this.futures2021 = this.data['futures2021']?this.data['futures2021'].split(','):[];
    this.futures2022 = this.data['futures2022']?this.data['futures2022'].split(','):[];
  }

}

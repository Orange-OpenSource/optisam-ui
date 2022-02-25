import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  version:string = localStorage.getItem('version');
  copyright:string = localStorage.getItem('copyright');
  constructor() { }

  ngOnInit() {
  }

}

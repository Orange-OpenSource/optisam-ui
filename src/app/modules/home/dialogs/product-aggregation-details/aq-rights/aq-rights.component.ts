import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-aq-rights',
  templateUrl: './aq-rights.component.html',
  styleUrls: ['./aq-rights.component.scss']
})
export class AqRightsComponent implements OnInit {
  @Input() acquireRights: any;
  constructor() { }

  ngOnInit() {
  }

}

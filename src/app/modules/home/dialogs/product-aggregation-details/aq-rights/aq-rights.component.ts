// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

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

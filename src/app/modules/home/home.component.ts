// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public navigationLoading: Boolean;
  navigationSubscription: Subscription;
  constructor(
    private sharedService: SharedService
  ) {
    this.navigationLoading = false;
    this.navigationSubscription = this.sharedService.navigationLoading().subscribe(data => {
      this.navigationLoading = data;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
  }
}

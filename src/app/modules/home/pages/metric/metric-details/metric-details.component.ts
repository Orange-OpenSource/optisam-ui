// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { MetricService } from 'src/app/core/services/metric.service';

@Component({
  selector: 'app-metric-details',
  templateUrl: './metric-details.component.html',
  styleUrls: ['./metric-details.component.scss']
})
export class MetricDetailsComponent implements OnInit {
  loadingSubscription: Subscription;
  HTTPActivity: Boolean;
  metricName: any;
  metricType: any;
  metricDescription: any;
  metricDetails:any;
  _loading: Boolean;

  constructor(private sharedService: SharedService,
    private metricService: MetricService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.loadingSubscription = this.sharedService.httpLoading().subscribe(data => {
      this.HTTPActivity = data;
    });
    this.metricName = this.data.name;
    this.metricType = this.data.type;
    this.metricDescription = this.data.description;
  };

  ngOnInit() {
    this.getMetricDetails();
  }

  getMetricDetails() {
    this._loading = true;
    this.metricService.getMetricDetails(this.metricType, this.metricName).subscribe(res=>{
      this.metricDetails = JSON.parse(res.metric_config);
      this._loading = false;
    },err=>{
      this._loading = false;
      console.log("Some error occured! Could not fetch metric details.")
    });
  }

}

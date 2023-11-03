import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorResponse } from '@core/modals';

@Component({
  selector: 'app-allocated-metric-delete-error',
  templateUrl: './allocated-metric-delete-error.component.html',
  styleUrls: ['./allocated-metric-delete-error.component.scss'],
})
export class AllocatedMetricDeleteErrorComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { error: ErrorResponse }) {}

  ngOnInit(): void {}
}

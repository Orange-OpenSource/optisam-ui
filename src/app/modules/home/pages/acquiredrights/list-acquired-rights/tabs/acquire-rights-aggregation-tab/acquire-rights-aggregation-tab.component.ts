import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-acquire-rights-aggregation-tab',
  templateUrl: './acquire-rights-aggregation-tab.component.html',
  styleUrls: ['./acquire-rights-aggregation-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcquireRightsAggregationTabComponent implements OnInit {
  @Input() aggregationDataSource: any;
  constructor() {}

  ngOnInit(): void {
    console.log('working');
    console.log(this.aggregationDataSource);
  }
}

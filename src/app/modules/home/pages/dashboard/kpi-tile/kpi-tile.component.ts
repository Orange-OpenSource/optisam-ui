import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-kpi-tile',
  templateUrl: './kpi-tile.component.html',
  styleUrls: ['./kpi-tile.component.scss'],
})
export class KpiTileComponent implements OnInit {
  @Input() tooltip: string = ``;
  @Input() header: string = ``;

  constructor() {}

  ngOnInit(): void {}
}

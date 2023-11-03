import { Component, ContentChild, Input, OnInit, TemplateRef, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-kpi-pie-block',
  templateUrl: './kpi-pie-block.component.html',
  styleUrls: ['./kpi-pie-block.component.scss']
})
export class KpiPieBlockComponent implements OnInit {
  @Input('data') data: any;
  @ContentChild('title') titleTemplate: TemplateRef<any>
  @ContentChild('chart') chart: TemplateRef<any> = null;


  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }


}

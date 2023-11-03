import { EventEmitter, Component, ContentChild, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { KpiOptions } from '@core/modals/dashboard.modal';
import { CommonService } from '@core/services';
import { LOCAL_KEYS } from '@core/util/constants/constants';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-kpi-block',
  templateUrl: './kpi-block.component.html',
  styleUrls: ['./kpi-block.component.scss'],
})
export class KpiBlockComponent implements OnInit {
  @Input('style') style = '';
  @Input('options') options: KpiOptions;
  @Input('checked') checked: boolean = false;
  @Input('disabled') disabled: boolean = false;
  @Output('change') changeStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ContentChild('kpiBlockContent', { static: false }) templateRef: TemplateRef<any>

  constructor() { }

  ngOnInit(): void { }
  changeToggle(changeStatus: boolean): void {
    this.changeStatus.next(changeStatus);
  }


}

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ProductCatalogAudit } from '@core/modals';
import { SingleAuditComponent } from './single-audit/single-audit.component';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditsComponent implements OnInit {
  @Input() auditData: ProductCatalogAudit[] = null;
  audits: FormArray;
  editorGroup: FormGroup;
  yearList: number[];

  constructor(private container: ControlContainer) {}

  ngOnInit(): void {
    this.editorGroup = this.container.control as FormGroup;
    this.audits = this.editorGroup?.get('audits') as FormArray;
    for (let data of this.auditData || []) this.addNewAudits(data);
  }

  addNewAudits(data: ProductCatalogAudit = null) {
    this.audits.push(SingleAuditComponent.addNewAudit(data));
  }
}

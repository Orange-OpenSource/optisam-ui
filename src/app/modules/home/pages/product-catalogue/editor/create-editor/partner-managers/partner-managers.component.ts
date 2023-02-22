import {
  Component,
  Input,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormArrayName,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '@core/services';
import { SinglePartnerManagerComponent } from './single-partner-manager/single-partner-manager.component';
import { ProductCatalogPartnerManager } from '@core/modals';

@Component({
  selector: 'app-partner-managers',
  templateUrl: './partner-managers.component.html',
  styleUrls: ['./partner-managers.component.scss'],
})
export class PartnerManagersComponent implements OnInit {
  @Input() view: boolean;
  @Input() partnerData: ProductCatalogPartnerManager[] = null;
  editorGroup: FormGroup;
  toDeleteItems: any;
  partnerManagers: FormArray;

  constructor(private dialog: MatDialog, private container: ControlContainer) {}

  ngOnInit(): void {
    this.editorGroup = this.container.control as FormGroup;
    this.partnerManagers = this.editorGroup?.get(
      'partner_managers'
    ) as FormArray;

    for (let data of this.partnerData || []) this.addNewPartnerManager(data);
  }

  addNewPartnerManager(data: ProductCatalogPartnerManager = null): void {
    this.partnerManagers.push(
      SinglePartnerManagerComponent.addPartnerManager(data)
    );
  }
}

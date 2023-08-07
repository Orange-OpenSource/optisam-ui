import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { OpenSourceType } from '@core/modals';
import { OPEN_SOURCE_LIST } from '@core/util/constants/constants';

@Component({
  selector: 'app-open-source',
  templateUrl: './open-source.component.html',
  styleUrls: ['./open-source.component.scss'],
})
export class OpenSourceComponent implements OnInit {
  @Input() openSourceFormGroup: FormGroup;

  constructor(private controlContainer: ControlContainer) {}
  openSourceForm: FormGroup;
  openSourceList: string[] = OPEN_SOURCE_LIST.sort();
  ngOnInit(): void {
    console.log(this.openSourceFormGroup);
    this.openSourceForm = this.controlContainer.control?.get(
      'OpenSource'
    ) as FormGroup;
  }

  get OpenLicenseType() {
    return this.openSourceForm?.get('openLicensesType');
  }

  get OpenLicenses() {
    return this.openSourceForm?.get('openLicenses');
  }
}

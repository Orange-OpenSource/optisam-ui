// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricCreationComponent } from './metric-creation.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MetricService } from 'src/app/core/services/metric.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('MetricCreationComponent', () => {
  let component: MetricCreationComponent;
  let fixture: ComponentFixture<MetricCreationComponent>;
  let spy: any;
  const metricTypes = [{ "name": "oracle.processor.standard", "description": "Number of processor licenses required = CPU nb x Core(per CPU) nb x CoreFactor", "href": "/api/v1/metric/ops", "type_id": "Oracle_Processor" }, { "name": "sag.processor.standard", "description": "Number of processor licenses required = MAX(Prod_licenses, NonProd_licenses) : licenses = CPU nb x Core(per CPU) nb x CoreFactor", "href": "/api/v1/metric/sps", "type_id": "SAG_Processor" }, { "name": "ibm.pvu.standard", "description": "Number of licenses required = CPU nb x Core(per CPU) nb x CoreFactor", "href": "/api/v1/metric/ips", "type_id": "IBM_PVU" }, { "name": "oracle.nup.standard", "description": "Named User Plus licenses required = MAX(A,B) : A = CPU nb x Core(per CPU) nb x CoreFactor x minimum number of NUP per processor, B = total number of current users with access to the Oracle product", "href": "/api/v1/metric/oracle_nup", "type_id": "Oracle_NUP" }, { "name": "attribute.counter.standard", "description": "Number of licenses required = Number of equipment of a specific type containing a specific atribute set to a specific value.", "href": "/api/v1/metric/acs", "type_id": "Attr_Counter" }, { "name": "instance.number.standard", "description": "Number Of instances where product has been installed multiply by a cofficent ,where instances are links between product and equipment(of any kind)", "href": "/api/v1/metric/inm", "type_id": "Instance_Number" }];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MetricCreationComponent],
      imports: [
        FormsModule,
        CustomMaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        EquipmentTypeManagementService,
        MetricService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'Add New Metric'", () => {
    const createMetricHeading = fixture.nativeElement.querySelector('mat-card-title');
    expect(createMetricHeading.innerText).toBe('Add New Metric');
  })

  it('fields should be visible based on metric type selected', () => {
    component.metricType = metricTypes;
    component.onChangeMetricType("{source:{value:'instance.number.standard'}}", 'instance.number.standard')
    component.metricTypRe = 'instance.number.standard';
    fixture.detectChanges();
    const coefficient = fixture.nativeElement.querySelector('input#coefficient');
    expect(coefficient).toBeDefined();
  })

  it('create button should be disabled if any required field is empty', () => {
    component.metricType = metricTypes;
    component.onChangeMetricType("{source:{value:'instance.number.standard'}}", 'instance.number.standard')
    component.metricTypRe = 'instance.number.standard';
    fixture.detectChanges();
    const coefficient = fixture.nativeElement.querySelector('input#coefficient');
    const createButton = fixture.nativeElement.querySelector('button#createButton');
    expect(createButton.disabled).toBe(true);
  })

  it('create button should be enabled if all required fields have value', () => {
    const metricName = fixture.nativeElement.querySelector('input#metricName');
    metricName.value = 'test_metric';
    metricName.dispatchEvent(new Event('input'));
    component.metricType = metricTypes;
    component.onChangeMetricType({ source: { value: 'instance.number.standard' } }, 'instance.number.standard')
    component.metricTypRe = 'instance.number.standard';
    fixture.detectChanges();
    const coefficient = fixture.nativeElement.querySelector('input#coefficient');
    coefficient.value = '100';
    coefficient.dispatchEvent(new Event('input'));
    component.getValididty();
    fixture.detectChanges();
    const createButton = fixture.nativeElement.querySelector('button#createButton');
    expect(createButton.disabled).toBe(false);
  })

  it('reset button should undo the changes done for selected metric type', () => {
    const metricName = fixture.nativeElement.querySelector('input#metricName');
    metricName.value = 'test_metric';
    metricName.dispatchEvent(new Event('input'));
    component.metricType = metricTypes;
    component.onChangeMetricType("{source:{value:'instance.number.standard'}}", 'instance.number.standard')
    component.metricTypRe = 'instance.number.standard';
    fixture.detectChanges();
    const coefficient = fixture.nativeElement.querySelector('input#coefficient');
    coefficient.value = '100';
    coefficient.dispatchEvent(new Event('input'));
    component.getValididty();
    fixture.detectChanges();
    const resetButton = fixture.nativeElement.querySelector('button#resetButton');
    resetButton.click();
    fixture.detectChanges();
    const coefficient_reset = fixture.nativeElement.querySelector('input#coefficient');
    expect(component.metricTypRe).toBeNull()
    expect(coefficient_reset).toBeFalsy();
  })
  // Validation error msgs
  it("no error message should be displayed if entered type name doesn't already exists", () => {
    const metricName = fixture.nativeElement.querySelector('input#metricName');
    metricName.value = 'test_metric';
    metricName.dispatchEvent(new Event('input'));
    component.TypeNameMsg = false;
    fixture.detectChanges();
    const errMsg = fixture.nativeElement.querySelector('.mat-error');
    expect(errMsg).toBeFalsy();
  })

  it("error message 'Type Name Already Exists' should be displayed if type name already exists", () => {
    const metricName = fixture.nativeElement.querySelector('input#metricName');
    metricName.value = 'test_metric';
    metricName.dispatchEvent(new Event('input'));
    component.TypeNameMsg = true;
    fixture.detectChanges();
    const errMsg = fixture.nativeElement.querySelector('.mat-error');
    expect(errMsg.innerText).toBe('Type Name Already Exists');
  })

  it("create button should be disabled if there's an error on the screen", () => {
    const metricName = fixture.nativeElement.querySelector('input#metricName');
    metricName.value = 'test_metric';
    metricName.dispatchEvent(new Event('input'));
    component.TypeNameMsg = true;
    component.metricType = metricTypes;
    component.onChangeMetricType("{source:{value:'instance.number.standard'}}", 'instance.number.standard')
    component.metricTypRe = 'instance.number.standard';
    fixture.detectChanges();
    const coefficient = fixture.nativeElement.querySelector('input#coefficient');
    coefficient.value = '100';
    coefficient.dispatchEvent(new Event('input'));
    component.getValididty();
    fixture.detectChanges();
    const createButton = fixture.nativeElement.querySelector('button#createButton');
    expect(createButton.disabled).toBe(true);
  })
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { MetricService } from 'src/app/core/services/metric.service';
import { CustomMaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { CreateMetricComponent } from './create-metric.component';

describe('CreateMetricComponent', () => {
  let component: CreateMetricComponent;
  let fixture: ComponentFixture<CreateMetricComponent>;
  const metricTypesList = [
    {
      "name": "oracle.processor.standard",
      "description": "Number of processor licenses required = CPU nb x Core(per CPU) nb x CoreFactor",
      "href": "/api/v1/metric/ops",
      "type_id": "Oracle_Processor"
    },
    {
      "name": "sag.processor.standard",
      "description": "Number of processor licenses required = MAX(Prod_licenses, NonProd_licenses) : licenses = CPU nb x Core(per CPU) nb x CoreFactor",
      "href": "/api/v1/metric/sps",
      "type_id": "SAG_Processor"
    },
    {
      "name": "ibm.pvu.standard",
      "description": "Number of licenses required = CPU nb x Core(per CPU) nb x CoreFactor",
      "href": "/api/v1/metric/ips",
      "type_id": "IBM_PVU"
    },
    {
      "name": "user.sum.standard",
      "description": "Number of licenses required = Sum of all users using the product.",
      "href": "/api/v1/metric/uss",
      "type_id": "User_Sum"
    },
    {
      "name": "oracle.nup.standard",
      "description": "Named User Plus licenses required = MAX(A,B) : A = CPU nb x Core(per CPU) nb x CoreFactor x minimum number of NUP per processor, B = total number of current users with access to the Oracle product",
      "href": "/api/v1/metric/oracle_nup",
      "type_id": "Oracle_NUP"
    }]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateMetricComponent],
      imports: [
        SharedModule,
        ReactiveFormsModule,
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMetricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.setItem('existingMetricNames', JSON.stringify(['test']));
  });
  afterEach(() => {
    localStorage.removeItem('existingMetricNames');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'Add New Metric'", () => {
    const createMetricHeading = fixture.nativeElement.querySelector('mat-card-title');
    expect(createMetricHeading.innerText).toBe('Add New Metric');
  })

  it('fields should be visible based on metric type selected', () => {
    component.metricTypesList = metricTypesList;
    component.type.setValue('sag.processor.standard');
    fixture.detectChanges();
    const referenceEquipment = fixture.nativeElement.querySelector('input#referenceEquipment');
    expect(referenceEquipment).toBeDefined();
    const core = fixture.nativeElement.querySelector('input#core');
    expect(core).toBeDefined();
    const corefactor = fixture.nativeElement.querySelector('input#corefactor');
    expect(corefactor).toBeDefined();
  })


  it('create button should be disabled if form is pristine or invalid or incomplete', () => {
    const createButton = fixture.nativeElement.querySelector('button#createButton');
    component._loading = false;
    // No changes
    expect(createButton.disabled).toBe(true);
    // Incomplete Form
    component.name.setValue('uniqueTest');
    component.metricTypesList = metricTypesList;
    component.type.setValue('sag.processor.standard');
    component.metricSelected('sag.processor.standard')
    component.referenceEquipment.setValue('server');
    component.core.setValue('sag');
    component.metricForm.markAsDirty();
    fixture.detectChanges();
    expect(createButton.disabled).toBe(true);
    // Invalid Form
    component.name.setValue('uniqueTest 1');
    component.metricTypesList = metricTypesList;
    component.type.setValue('sag.processor.standard');
    component.referenceEquipment.setValue('server');
    component.core.setValue('sag');
    component.corefactor.setValue('pvu');
    component.metricForm.markAsDirty();
    fixture.detectChanges();
    expect(component.name.getError('pattern')).toBeTruthy();
    expect(createButton.disabled).toBe(true);
  })

  it('create button should be enabled if form is valid', () => {
    component._loading = false;
    component.name.setValue('uniqueTest');
    component.metricTypesList = metricTypesList;
    component.type.setValue('sag.processor.standard');
    component.metricSelected('sag.processor.standard')
    component.referenceEquipment.setValue('server');
    component.core.setValue('sag');
    component.corefactor.setValue('pvu');
    component.metricForm.markAsDirty();
    fixture.detectChanges();
    const createButton = fixture.nativeElement.querySelector('button#createButton');
    expect(createButton.disabled).toBe(true);
  })

  // Validation error msgs
  it("no error message should be displayed if entered type name doesn't already exists", () => {
    component.name.setValue('uniqueTest');
    component.metricTypesList = metricTypesList;
    component.type.setValue('sag.processor.standard');
    component.metricSelected('sag.processor.standard')
    component.referenceEquipment.setValue('server');
    component.core.setValue('sag');
    component.corefactor.setValue('pvu');
    component.metricForm.markAsDirty();
    fixture.detectChanges();
    const nameError = component.name.errors;
    expect(nameError).toBeNull();
  })

  it("error message 'Type Name Already Exists' should be displayed if type name already exists", () => {
    component.name.setValue('test');
    component.metricTypesList = metricTypesList;
    component.type.setValue('sag.processor.standard');
    component.metricSelected('sag.processor.standard')
    component.referenceEquipment.setValue('server');
    component.core.setValue('sag');
    component.corefactor.setValue('pvu');
    component.metricForm.markAsDirty();
    fixture.detectChanges();
    expect(component.name.getError('duplicateName')).toBeTruthy();
  })
});
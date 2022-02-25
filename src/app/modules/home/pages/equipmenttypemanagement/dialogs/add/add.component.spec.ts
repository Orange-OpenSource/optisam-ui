import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComponent } from './add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  const metadata = [
    {
      "ID": "101",
      "name": "Source1",
      "attributes": [
        { "ID": "x101a", "name": "abc_name", "data_type": "STRING", "primary_key": true, "displayed": true, "searchable": true, "mapped_to": "abc_name" }
      ]
    },
    {
      "ID": "102",
      "name": "Source2",
      "attributes": [
        { "ID": "x102a", "name": "xyz_name", "data_type": "STRING", "primary_key": true, "displayed": true, "searchable": true, "mapped_to": "xyz_name" }
      ]
    }
  ]

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddComponent],
      imports: [
        ReactiveFormsModule,
        CustomMaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        EquipmentTypeManagementService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'Create New Equipment'", () => {
    const createEqpHeading = fixture.nativeElement.querySelector('mat-card-title');
    expect(createEqpHeading.innerText).toBe('Create New Equipment');
  })
  // Validation error msgs
  it("no error message should be displayed if entered type name doesn't already exist", () => {
    const typeName = fixture.nativeElement.querySelector('input#type');
    typeName.value = 'test_equipment';
    typeName.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const errMsg = fixture.nativeElement.querySelector('.mat-error');
    expect(errMsg).toBeFalsy();
  })

  it("error message 'Type Name already exists' should be displayed if type name already exist", () => {
    component.types = [{
      "type":"test_metric"
    }]
    const typeName = fixture.nativeElement.querySelector('input#type');
    typeName.value = 'test_metric';
    typeName.dispatchEvent(new Event('input'));
    
    fixture.detectChanges();
    const errMsg = fixture.nativeElement.querySelector('.mat-error');
    console.log(errMsg);
    expect(errMsg.innerText).toBe('Type Name already exists');
  })

  it("create button should be disabled if there's an error on the screen", () => {
    const typeName = fixture.nativeElement.querySelector('input#type');
    typeName.value = 'test_metric #';
    typeName.dispatchEvent(new Event('input'));
    component.metaData = metadata;
    component.from.setValue('101');
    component.filterAttributes({ isUserInput: true, source: { value: '101' } });
    const addAttrButton = fixture.nativeElement.querySelector('button#addAttrButton');
    addAttrButton.click();
    component.attribute.setValue([{
      'data_type': 'string',
      'displayed': 'true',
      'mapped_to': 'xyz',
      'name': 'abc_name',
      'parent_identifier': null,
      'primary_key': 'true',
      'searchable': 'true'
    }])
    component.onChange({ checked: true }, 0)
    fixture.detectChanges();
    const createButton = fixture.nativeElement.querySelector('button#createButton');
    expect(createButton.disabled).toBe(true);
  })

  it("create button should be disabled if there's no primary attribute", () => {
    const typeName = fixture.nativeElement.querySelector('input#type');
    typeName.value = 'test_metric';
    typeName.dispatchEvent(new Event('input'));
    component.metaData = metadata;
    component.from.setValue('101');
    component.filterAttributes({ isUserInput: true, source: { value: '101' } });
    const addAttrButton = fixture.nativeElement.querySelector('button#addAttrButton');
    addAttrButton.click();
    component.attribute.setValue([{
      'data_type': 'string',
      'displayed': true,
      'mapped_to': 'xyz',
      'name': 'abc_name',
      'parent_identifier': null,
      'primary_key': false,
      'searchable': true
    }])
    component.onChange({ checked: false }, 0)
    fixture.detectChanges();
    const createButton = fixture.nativeElement.querySelector('button#createButton');
    expect(createButton.disabled).toBe(true);
  })

  it("create button should be disabled if there's no parent attribute selected when parent type is selected", () => {
    const typeName = fixture.nativeElement.querySelector('input#type');
    typeName.value = 'test_metric';
    typeName.dispatchEvent(new Event('input'));
    component.metaData = metadata;
    component.from.setValue('101');
    component.filterAttributes({ isUserInput: true, source: { value: '101' } });
    component.root.setValue('102');
    component.onSelect('102');
    const addAttrButton = fixture.nativeElement.querySelector('button#addAttrButton');
    addAttrButton.click();
    component.attribute.setValue([{
      'data_type': 'string',
      'displayed': true,
      'mapped_to': 'xyz',
      'name': 'abc_name',
      'parent_identifier': null,
      'primary_key': true,
      'searchable': true
    }])
    component.onChange({ checked: true }, 0)
    fixture.detectChanges();
    const createButton = fixture.nativeElement.querySelector('button#createButton');
    expect(createButton.disabled).toBe(true);
  })

  it("create button should be enabled if all required fields have values", () => {
    const typeName = fixture.nativeElement.querySelector('input#type');
    typeName.value = 'test_metric';
    typeName.dispatchEvent(new Event('input'));
    // component.scope.setValue('TST');
    // component.onScopeSelected();
    component.metaData = metadata;
    component.from.setValue('101');
    component.filterAttributes({ isUserInput: true, source: { value: '101' } });
    component.root.setValue('102');
    component.onSelect('102');
    const addAttrButton = fixture.nativeElement.querySelector('button#addAttrButton');
    addAttrButton.click();
    addAttrButton.click();
    component.attribute.setValue([{
      'data_type': 'string',
      'displayed': true,
      'mapped_to': 'xyz',
      'name': 'abc_name',
      'parent_identifier': false,
      'primary_key': true,
      'searchable': true
    },
    {
      'data_type': 'string',
      'displayed': true,
      'mapped_to': 'xyz',
      'name': 'def_name',
      'parent_identifier': true,
      'primary_key': false,
      'searchable': true
    }
    ])
    component.onChange({ checked: true }, 0)
    component.onChangeParentI({ checked: true }, 1);
    fixture.detectChanges();
    const createButton = fixture.nativeElement.querySelector('button#createButton');
    expect(createButton.disabled).toBe(false);
  })

  it("'ParentId' checkbox should be disabled if 'PK' checkbox is checked for an attribute or vice-versa", () => {
    const typeName = fixture.nativeElement.querySelector('input#type');
    typeName.value = 'test_metric';
    typeName.dispatchEvent(new Event('input'));
    component.metaData = metadata;
    component.from.setValue('101');
    component.filterAttributes({ isUserInput: true, source: { value: '101' } });
    component.root.setValue('102');
    component.onSelect('102');
    const addAttrButton = fixture.nativeElement.querySelector('button#addAttrButton');
    addAttrButton.click();
    addAttrButton.click();
    component.attribute.setValue([{
      'data_type': 'string',
      'displayed': true,
      'mapped_to': 'xyz',
      'name': 'abc_name',
      'parent_identifier': false,
      'primary_key': true,
      'searchable': true
    },
    {
      'data_type': 'string',
      'displayed': true,
      'mapped_to': 'xyz',
      'name': 'def_name',
      'parent_identifier': true,
      'primary_key': false,
      'searchable': true
    }
    ])
    component.onChange({ checked: true }, 0)
    component.onChangeParentI({ checked: true }, 1);
    fixture.detectChanges();
    const ParentID_checkbox_0 = fixture.nativeElement.querySelector('input#ParentID_checkbox_0-input');
    expect(ParentID_checkbox_0.disabled).toBe(true);
    const PK_checkbox_1 = fixture.nativeElement.querySelector('input#PK_checkbox_1-input');
    expect(PK_checkbox_1.disabled).toBe(true);
  })

  it("reset button should clear all the entered values", () => {
    const typeName = fixture.nativeElement.querySelector('input#type');
    typeName.value = 'test_metric';
    typeName.dispatchEvent(new Event('input'));
    component.metaData = metadata;
    component.from.setValue('101');
    component.filterAttributes({ isUserInput: true, source: { value: '101' } });
    component.root.setValue('102');
    component.onSelect('102');
    const addAttrButton = fixture.nativeElement.querySelector('button#addAttrButton');
    addAttrButton.click();
    addAttrButton.click();
    component.attribute.setValue([{
      'data_type': 'string',
      'displayed': true,
      'mapped_to': 'xyz',
      'name': 'abc_name',
      'parent_identifier': false,
      'primary_key': true,
      'searchable': true
    },
    {
      'data_type': 'string',
      'displayed': true,
      'mapped_to': 'xyz',
      'name': 'def_name',
      'parent_identifier': true,
      'primary_key': false,
      'searchable': true
    }
    ])
    component.onChange({ checked: true }, 0)
    component.onChangeParentI({ checked: true }, 1);
    component.onFormReset();
    fixture.detectChanges();
    expect(component.type.value).toBeNull();
    expect(component.from.value).toBeNull();
    expect(component.root.value).toBeNull();
    expect(component.attribute.value.length).toBe(0);
  })
});

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponent } from './edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomMaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  const attributes = [
    {
      ID: 'x101a',
      name: 'abc_name',
      data_type: 'STRING',
      primary_key: true,
      displayed: true,
      searchable: true,
      mapped_to: 'abc_name',
    },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditComponent],
      imports: [
        ReactiveFormsModule,
        CustomMaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        EquipmentTypeManagementService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('root field should be empty if no parent is specified already', () => {
    const rootValue = component.root.value;
    expect(rootValue).toBe(null);
  });

  it('root field should be pre-populated if parent is specified already', () => {
    component.root.setValue('Abc');
    fixture.detectChanges();
    const rootValue = component.root.value;
    expect(rootValue).toBe('Abc');
  });

  it('list of existing attributes should be visible', () => {
    component.attributes = attributes;
    fixture.detectChanges();
    const attrListHeading =
      fixture.nativeElement.querySelector('mat-card-title');
    const header = fixture.nativeElement.querySelectorAll('mat-header-cell');
    expect(attrListHeading.innerText).toBe('Attribute List');
    expect(header[0].innerText).toBe('Name');
  });

  it('modify button should be disabled if no changes are made', () => {
    const modifyBtn = fixture.nativeElement.querySelector(
      'button#modifyButton'
    );
    expect(modifyBtn.disabled).toBe(true);
  });

  it('modify button should be enabled if valid changes are made', () => {
    component.root.setValue('Abc');
    component.metaData = ['xyz', 'def'];
    fixture.detectChanges();
    const addAttrButton = fixture.nativeElement.querySelector(
      'button#addAttrButton'
    );
    addAttrButton.click();
    component.attribute_form.setValue([
      {
        data_type: 'string',
        displayed: true,
        mapped_to: 'xyz',
        name: 'abc_name',
        searchable: true,
        parent_identifier: true,
      },
    ]);
    component.attributeForm.markAsDirty();
    fixture.detectChanges();
    const modifyBtn = fixture.nativeElement.querySelector(
      'button#modifyButton'
    );
    expect(modifyBtn.disabled).toBe(false);
  });

  it('reset button should clear all the entered values', () => {
    component.root.setValue('Abc');
    component.metaData = ['xyz', 'def'];
    fixture.detectChanges();
    const addAttrButton = fixture.nativeElement.querySelector(
      'button#addAttrButton'
    );
    addAttrButton.click();
    component.attribute_form.setValue([
      {
        data_type: 'string',
        displayed: true,
        mapped_to: 'xyz',
        name: 'abc_name',
        searchable: true,
        parent_identifier: true,
      },
    ]);
    component.attributeForm.markAsDirty();
    const resetButton =
      fixture.nativeElement.querySelector('button#resetButton');
    resetButton.click();
    fixture.detectChanges();
    expect(component.attribute_form.pristine).toBe(true);
  });
});

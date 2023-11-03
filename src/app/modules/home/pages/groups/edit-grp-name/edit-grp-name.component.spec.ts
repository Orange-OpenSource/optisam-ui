import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrpNameComponent } from './edit-grp-name.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('EditGrpNameComponent', () => {
  let component: EditGrpNameComponent;
  let fixture: ComponentFixture<EditGrpNameComponent>;
  let editNode = { name: 'group1', fully_qualified_name: 'Parent.Child' };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditGrpNameComponent],
      imports: [
        CustomMaterialModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrpNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('page heading should be fully qualified name', () => {
    component.data.item = editNode;
    component.ngOnInit();
    component.group.fully_qualified_name = 'Parent.Child';
    fixture.detectChanges();
    const viewScopesHeading =
      fixture.nativeElement.querySelector('.mat-card-title');
    expect(viewScopesHeading.innerText).toContain('Parent.Child');
    expect(viewScopesHeading.innerText).toContain('Edit Group');
  });

  it('root field pre-poulated with existing value should be enabled for the user to edit', () => {
    component.data.item = editNode;
    component.ngOnInit();
    component.group.name = 'group1';
    fixture.detectChanges();
    const name = fixture.nativeElement.querySelector('input#name');
    expect(name.disabled).toBeFalsy();
    expect(component.name.value).toBe('group1');
  });

  it('reset button should remain disabled if group name is not modified', () => {
    component.data.item = editNode;
    component.ngOnInit();
    fixture.detectChanges();
    const resetButton =
      fixture.nativeElement.querySelector('button#resetButton');
    expect(resetButton.disabled).toBeTruthy();
  });

  it('reset button should be enabled if group name is modified', () => {
    component.data.item = editNode;
    component.ngOnInit();
    component.group.name = 'group1';
    component.name?.setValue('groupNew');
    component.name.markAsDirty();
    fixture.detectChanges();
    const resetButton =
      fixture.nativeElement.querySelector('button#resetButton');
    expect(resetButton.disabled).toBeFalsy();
  });

  it('save button should remain disabled if group name is not modified', () => {
    component.data.item = editNode;
    component.ngOnInit();
    fixture.detectChanges();
    const updateButton = fixture.nativeElement.querySelector(
      'button#updateButton'
    );
    expect(updateButton.disabled).toBeTruthy();
  });

  it('save button should be enabled if group name is modified', () => {
    component.data.item = editNode;
    component.ngOnInit();
    component.name.setValue('groupNew');
    component.groupCompliance?.setValue(true);
    component.scopes.setValue(['abc', 'bcd']);
    component.name.markAsDirty();
    fixture.detectChanges();
    const updateButton = fixture.nativeElement.querySelector(
      'button#updateButton'
    );
    expect(updateButton.disabled).toBeFalsy();
  });
});

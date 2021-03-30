// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserGrpComponent } from './create-user-grp.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateUserGrpComponent', () => {
  let component: CreateUserGrpComponent;
  let fixture: ComponentFixture<CreateUserGrpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUserGrpComponent],
      imports: [
        CustomMaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserGrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'Add User'", () => {
    const addUserHeading = fixture.nativeElement.querySelector('.mat-card-title');
    expect(addUserHeading.innerText).toBe('Add User');
  })

  it("'Name' field should be invalid if its value is empty", () => {
    component.first_name.setValue('');
    expect(component.first_name.invalid).toBeTruthy();
  })

  it("'Name' field should be invalid if its value is not in ^[a-zA-Z0-9_]*$ format", () => {
    component.first_name.setValue('A Test*');
    expect(component.first_name.invalid).toBeTruthy();
  })

  it("'Name' field should be valid if its value is in ^[a-zA-Z0-9_]*$ format", () => {
    component.first_name.setValue('Test');
    expect(component.first_name.valid).toBeTruthy();
  })

  it("'Surname' field should be invalid if its value is empty", () => {
    component.last_name.setValue('');
    expect(component.last_name.invalid).toBeTruthy();
  })

  it("'Surname' field should be invalid if its value is not in ^[a-zA-Z0-9_]*$ format", () => {
    component.last_name.setValue('A Test*');
    expect(component.last_name.invalid).toBeTruthy();
  })

  it("'Surname' field should be valid if its value is in ^[a-zA-Z0-9_]*$ format", () => {
    component.last_name.setValue('Test');
    expect(component.last_name.valid).toBeTruthy();
  })

  it("'Email' field should be invalid if its value is empty", () => {
    component.user_id.setValue('');
    expect(component.user_id.invalid).toBeTruthy();
  })

  it("'Email' field should be invalid if its value is not in email format", () => {
    component.user_id.setValue('user123');
    expect(component.user_id.invalid).toBeTruthy();
  })

  it("'Email' field should be valid if its value is in email format", () => {
    component.user_id.setValue('user@test.com');
    expect(component.user_id.valid).toBeTruthy();
  })

  it("reset button should be disabled if no change is made", () => {
    const resetBtn = fixture.debugElement.nativeElement.querySelector('button#resetBtn');
    expect(resetBtn.disabled).toBe(true)
  })

  it("reset button should be enabled if any change is made", () => {
    component.first_name.setValue('User');
    component.last_name.setValue('test');
    component.groupForm.markAsTouched();
    component.groupForm.markAsDirty();
    fixture.detectChanges();
    const resetBtn = fixture.debugElement.nativeElement.querySelector('button#resetBtn');
    expect(resetBtn.disabled).toBe(false)
  })

  it("reset button should undo the changes made", () => {
    component.first_name.setValue('User');
    component.last_name.setValue('test');
    component.user_id.setValue('user@test.com');
    component.role.setValue('USER');
    component.groupForm.markAsTouched();
    component.groupForm.markAsDirty();
    fixture.detectChanges();
    const resetBtn = fixture.debugElement.nativeElement.querySelector('button#resetBtn');
    resetBtn.click();
    fixture.detectChanges();
    expect(component.first_name.value).toBeNull;
    expect(component.last_name.value).toBeNull;
    expect(component.user_id.value).toBeNull;
    expect(component.role.value).toBeNull;
    expect(resetBtn.disabled).toBeTruthy();
  })

  it("create button should be disabled if any form field is invalid", () => {
    component.first_name.setValue('User');
    component.last_name.setValue('test');
    component.user_id.setValue('user@test.com');
    // Groups is optional
    // Role is mandatory, but we're not setting any value to test form invalid scenario
    component.groupForm.markAsTouched();
    component.groupForm.markAsDirty();
    fixture.detectChanges();
    expect(component.groupForm.invalid).toBeTruthy();
    const createBtn = fixture.debugElement.nativeElement.querySelector('button#createBtn');
    expect(createBtn.disabled).toBe(true)
  })

  it("create button should be enabled if all fields are valid", () => {
    component.first_name.setValue('User');
    component.last_name.setValue('test');
    component.user_id.setValue('user@test.com');
    // Groups is optional
    component.role.setValue('USER');
    component.groupForm.markAsTouched();
    component.groupForm.markAsDirty();
    fixture.detectChanges();
    expect(component.groupForm.valid).toBeTruthy();
    const createBtn = fixture.debugElement.nativeElement.querySelector('button#createBtn');
    expect(createBtn.disabled).toBe(false)
  })
});

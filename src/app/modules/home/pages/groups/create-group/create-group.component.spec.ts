import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupComponent } from './create-group.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('CreateGroupComponent', () => {
  let component: CreateGroupComponent;
  let fixture: ComponentFixture<CreateGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateGroupComponent
      ],
      imports: [
        CustomMaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'Create Group'", () => {
    const createGroupHeading = fixture.nativeElement.querySelector('mat-card-title');
    expect(createGroupHeading.innerText).toContain('Create Group');
  })

  it("'Name' field should be invalid if its value is empty", () => {
    component.name.setValue('');
    expect(component.name.invalid).toBeTruthy();
  })

  it("'Name' field should be invalid if its value is not in ^[a-zA-Z0-9_]*$ format", () => {
    component.name.setValue('A Test*');
    expect(component.name.invalid).toBeTruthy();
  })

  it("'Name' field should be valid if its value is in ^[a-zA-Z0-9_]*$ format", () => {
    component.name.setValue('Test');
    expect(component.name.valid).toBeTruthy();
  })

  it("'Parent Name' field should be auto-populated and disabled", () => {
    component.data.name = 'Parent';
    component.ngOnInit();
    component.name.setValue('Test');
    fixture.detectChanges();
    expect(component.groupName.value).toBe('Parent');
    expect(component.groupName.disabled).toBeTruthy();
  })

  it("reset button should be disabled if no change is made", () => {
    const resetButton = fixture.debugElement.nativeElement.querySelector('button#resetButton');
    expect(resetButton.disabled).toBe(true)
  })

  it("reset button should be enabled if any change is made", () => {
    component.data.name = 'Parent';
    component.ngOnInit();
    component.name.setValue('Test');
    component.groupForm.markAsTouched();
    component.groupForm.markAsDirty();
    fixture.detectChanges();
    const resetButton = fixture.debugElement.nativeElement.querySelector('button#resetButton');
    expect(resetButton.disabled).toBe(false)
  })

  it("reset button should undo the changes made", () => {
    component.data.name = 'Parent';
    component.ngOnInit();
    component.name.setValue('Test');
    component.groupForm.markAsTouched();
    component.groupForm.markAsDirty();
    fixture.detectChanges();
    const resetButton = fixture.debugElement.nativeElement.querySelector('button#resetButton');
    resetButton.click();
    fixture.detectChanges();
    expect(component.name.value).toBeNull;
    expect(resetButton.disabled).toBeTruthy();
  })

  it("create button should be disabled if any form field is invalid", () => {
    component.data.name = 'Parent';
    component.ngOnInit();
    component.name.setValue('Test  *123'); //Invalid name pattern
    component.groupForm.markAsTouched();
    component.groupForm.markAsDirty();
    fixture.detectChanges();
    expect(component.groupForm.invalid).toBeTruthy();
    const createButton = fixture.debugElement.nativeElement.querySelector('button#createButton');
    expect(createButton.disabled).toBe(true)
  })

  it("create button should be enabled if all fields are valid", () => {
    component.data.name = 'Parent';
    component.ngOnInit();
    component.name.setValue('Test');
    component.scopes.setValue(['TST1', 'TST2']);
    component.groupForm.markAsTouched();
    component.groupForm.markAsDirty();
    fixture.detectChanges();
    expect(component.groupForm.valid).toBeTruthy();
    const createButton = fixture.debugElement.nativeElement.querySelector('button#createButton');
    expect(createButton.disabled).toBe(false)
  })
});

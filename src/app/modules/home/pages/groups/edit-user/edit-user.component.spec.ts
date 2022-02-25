import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserComponent } from './edit-user.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserComponent],
      imports: [
        CustomMaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'Update User'", () => {
    const editUserHeading = fixture.nativeElement.querySelector('.mat-card-title');
    expect(editUserHeading.innerText).toBe('Update User');
  })

  it("reset button should be disabled if role is not changed", () => {
    component.first_name.setValue('Test');
    component.last_name.setValue('User');
    component.user_id.setValue('user@test.com');
    component.role.setValue('ADMIN');
    const resetBtn = fixture.debugElement.nativeElement.querySelector('button#resetBtn');
    expect(resetBtn.disabled).toBe(true);
  })

  it("reset button should be enabled if role is changed", () => {
    component.first_name.setValue('Test');
    component.last_name.setValue('User');
    component.user_id.setValue('user@test.com');
    component.role.setValue('ADMIN');
    component.role.setValue('USER');
    component.groupForm.markAsTouched();
    component.groupForm.markAsDirty();
    fixture.detectChanges();
    expect(component.groupForm.valid).toBeTruthy();
    const resetBtn = fixture.debugElement.nativeElement.querySelector('button#resetBtn');
    expect(resetBtn.disabled).toBe(false);
  })

  it("reset button should undo the changes done", () => {
    component.first_name.setValue('Test');
    component.last_name.setValue('User');
    component.user_id.setValue('user@test.com');
    component.role.setValue('USER');
    component.groupForm.markAsTouched();
    component.groupForm.markAsDirty();
    fixture.detectChanges();
    const resetBtn = fixture.debugElement.nativeElement.querySelector('button#resetBtn');
    spyOn(component, 'setFormData');
    resetBtn.click();
    component.role.setValue('ADMIN');
    fixture.detectChanges();
    expect(component.setFormData).toHaveBeenCalled();
    expect(component.role.value).toBe('ADMIN');
  })

  it("create button should be disabled if role is not changed", () => {
    component.first_name.setValue('Test');
    component.last_name.setValue('User');
    component.user_id.setValue('user@test.com');
    component.role.setValue('ADMIN');
    const createBtn = fixture.debugElement.nativeElement.querySelector('button#createBtn');
    expect(createBtn.disabled).toBe(true);
  })

  it("create button should be enabled if role is changed", () => {
    component.first_name.setValue('Test');
    component.last_name.setValue('User');
    component.user_id.setValue('user@test.com');
    component.role.setValue('ADMIN');
    component.role.setValue('USER');
    component.groupForm.markAsTouched();
    component.groupForm.markAsDirty();
    fixture.detectChanges();
    expect(component.groupForm.valid).toBeTruthy();
    const createBtn = fixture.debugElement.nativeElement.querySelector('button#createBtn');
    expect(createBtn.disabled).toBe(false);
  })
});

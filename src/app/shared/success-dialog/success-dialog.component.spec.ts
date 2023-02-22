import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { SuccessDialogComponent } from './success-dialog.component';

describe('SuccessDialogComponent', () => {
  let component: SuccessDialogComponent;
  let fixture: ComponentFixture<SuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

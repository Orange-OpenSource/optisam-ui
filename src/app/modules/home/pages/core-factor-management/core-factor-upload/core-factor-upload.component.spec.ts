import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreFactorUploadComponent } from './core-factor-upload.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CustomMaterialModule } from 'src/app/material.module';

describe('CoreFactorUploadComponent', () => {
  let component: CoreFactorUploadComponent;
  let fixture: ComponentFixture<CoreFactorUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoreFactorUploadComponent],
      imports: [
        HttpClientTestingModule,
        CustomMaterialModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreFactorUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

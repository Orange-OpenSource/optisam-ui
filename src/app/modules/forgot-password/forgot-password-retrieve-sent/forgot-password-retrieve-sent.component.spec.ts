import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordRetrieveSentComponent } from './forgot-password-retrieve-sent.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';

describe('ForgotPasswordRetrieveSentComponent', () => {
  let component: ForgotPasswordRetrieveSentComponent;
  let fixture: ComponentFixture<ForgotPasswordRetrieveSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordRetrieveSentComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule, CustomMaterialModule],

    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordRetrieveSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { FormBuilder } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChangePasswordComponent } from './user-change-password.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@core/services';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserChangePasswordComponent', () => {
  let component: UserChangePasswordComponent;
  let fixture: ComponentFixture<UserChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserChangePasswordComponent],
      providers: [FormBuilder, AuthService],
      imports: [TranslateModule.forRoot(), MatDialogModule, HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

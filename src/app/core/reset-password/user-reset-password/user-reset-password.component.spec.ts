import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResetPasswordComponent } from './user-reset-password.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { AuthService } from '@core/auth/auth.service';

describe('UserResetPasswordComponent', () => {
  let component: UserResetPasswordComponent;
  let fixture: ComponentFixture<UserResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserResetPasswordComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule, CustomMaterialModule],
      providers: [AuthService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

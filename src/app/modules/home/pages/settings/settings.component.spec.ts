import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SettingsComponent,
        ProfileSettingsComponent,
        ChangePasswordComponent
      ],
      imports: [
        ReactiveFormsModule,
        CustomMaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

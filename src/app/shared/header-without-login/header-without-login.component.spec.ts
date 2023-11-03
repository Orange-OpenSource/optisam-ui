import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderWithoutLoginComponent } from './header-without-login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@core/auth/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomMaterialModule } from 'src/app/material.module';

describe('HeaderWithoutLoginComponent', () => {
  let component: HeaderWithoutLoginComponent;
  let fixture: ComponentFixture<HeaderWithoutLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderWithoutLoginComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule, CustomMaterialModule],
      providers: [AuthService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderWithoutLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

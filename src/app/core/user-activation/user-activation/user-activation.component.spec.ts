import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivationComponent } from './user-activation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { Router } from '@angular/router';

describe('UserActivationComponent', () => {
  let component: UserActivationComponent;
  let fixture: ComponentFixture<UserActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserActivationComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule, CustomMaterialModule],
      providers: [Router]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});

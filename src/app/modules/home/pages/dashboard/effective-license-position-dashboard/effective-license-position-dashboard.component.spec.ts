import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectiveLicensePositionDashboardComponent } from './effective-license-position-dashboard.component';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { AbsoluteValuePipe } from '@shared/common-pipes/absolute-value.pipe';
import { FrenchNumberPipe } from '@shared/common-pipes/french-number.pipe';

describe('EffectiveLicensePositionDashboardComponent', () => {
  let component: EffectiveLicensePositionDashboardComponent;
  let fixture: ComponentFixture<EffectiveLicensePositionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EffectiveLicensePositionDashboardComponent, AbsoluteValuePipe, FrenchNumberPipe],
      imports: [MatDialogModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [ProductService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectiveLicensePositionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareExpenditureDashboardComponent } from './software-expenditure-dashboard.component';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';

describe('SoftwareExpenditureDashboardComponent', () => {
  let component: SoftwareExpenditureDashboardComponent;
  let fixture: ComponentFixture<SoftwareExpenditureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftwareExpenditureDashboardComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule],
      providers: [ProductService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareExpenditureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareUsageExpenditureDashboardComponent } from './software-usage-expenditure-dashboard.component';

describe('SoftwareUsageExpenditureDashboardComponent', () => {
  let component: SoftwareUsageExpenditureDashboardComponent;
  let fixture: ComponentFixture<SoftwareUsageExpenditureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoftwareUsageExpenditureDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareUsageExpenditureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

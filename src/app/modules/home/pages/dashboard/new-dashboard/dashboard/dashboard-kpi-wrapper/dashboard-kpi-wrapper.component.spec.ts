import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardKpiWrapperComponent } from './dashboard-kpi-wrapper.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DashboardKpiWrapperComponent', () => {
  let component: DashboardKpiWrapperComponent;
  let fixture: ComponentFixture<DashboardKpiWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardKpiWrapperComponent],
      imports: [TranslateModule.forRoot()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardKpiWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizeDashboardComponent } from './optimize-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';

describe('OptimizeDashboardComponent', () => {
  let component: OptimizeDashboardComponent;
  let fixture: ComponentFixture<OptimizeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OptimizeDashboardComponent],
      imports: [TranslateModule.forRoot()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

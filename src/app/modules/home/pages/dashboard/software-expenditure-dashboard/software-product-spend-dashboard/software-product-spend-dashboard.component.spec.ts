import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareProductSpendDashboardComponent } from './software-product-spend-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SoftwareProductSpendDashboardComponent', () => {
  let component: SoftwareProductSpendDashboardComponent;
  let fixture: ComponentFixture<SoftwareProductSpendDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftwareProductSpendDashboardComponent],
      imports: [TranslateModule.forRoot()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareProductSpendDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

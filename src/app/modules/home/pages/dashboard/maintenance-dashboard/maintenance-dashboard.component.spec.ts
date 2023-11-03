import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceDashboardComponent } from './maintenance-dashboard.component';

describe('MaintenanceDashboardComponent', () => {
  let component: MaintenanceDashboardComponent;
  let fixture: ComponentFixture<MaintenanceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

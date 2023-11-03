import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkDashboardComponent } from './park-dashboard.component';

describe('ParkDashboardComponent', () => {
  let component: ParkDashboardComponent;
  let fixture: ComponentFixture<ParkDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParkDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedReceivedLicensesDashboardComponent } from './shared-received-licenses-dashboard.component';

describe('SharedReceivedLicensesDashboardComponent', () => {
  let component: SharedReceivedLicensesDashboardComponent;
  let fixture: ComponentFixture<SharedReceivedLicensesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedReceivedLicensesDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedReceivedLicensesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

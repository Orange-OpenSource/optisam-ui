import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquiredRightsTabComponent } from './acquired-rights-tab.component';

describe('AcquiredRightsTabComponent', () => {
  let component: AcquiredRightsTabComponent;
  let fixture: ComponentFixture<AcquiredRightsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcquiredRightsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquiredRightsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

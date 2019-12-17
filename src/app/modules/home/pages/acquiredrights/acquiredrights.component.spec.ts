import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquiredrightsComponent } from './acquiredrights.component';

describe('AcquiredrightsComponent', () => {
  let component: AcquiredrightsComponent;
  let fixture: ComponentFixture<AcquiredrightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcquiredrightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquiredrightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

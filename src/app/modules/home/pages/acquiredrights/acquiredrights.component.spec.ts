import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquiredrightsComponent } from './acquiredrights.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AcquiredrightsComponent', () => {
  let component: AcquiredrightsComponent;
  let fixture: ComponentFixture<AcquiredrightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcquiredrightsComponent ],
      imports : [ RouterTestingModule]
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

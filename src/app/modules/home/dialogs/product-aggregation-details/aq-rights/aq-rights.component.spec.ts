import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AqRightsComponent } from './aq-rights.component';

describe('AqRightsComponent', () => {
  let component: AqRightsComponent;
  let fixture: ComponentFixture<AqRightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AqRightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AqRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

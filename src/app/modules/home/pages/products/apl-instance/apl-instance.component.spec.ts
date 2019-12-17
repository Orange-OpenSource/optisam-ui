import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AplInstanceComponent } from './apl-instance.component';

describe('AplInstanceComponent', () => {
  let component: AplInstanceComponent;
  let fixture: ComponentFixture<AplInstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AplInstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AplInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

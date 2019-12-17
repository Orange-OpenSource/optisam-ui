import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AplDetailsComponent } from './apl-details.component';

describe('AplDetailsComponent', () => {
  let component: AplDetailsComponent;
  let fixture: ComponentFixture<AplDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AplDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AplDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

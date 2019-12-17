import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmenttypemanagementComponent } from './equipmenttypemanagement.component';

describe('EquipmenttypemanagementComponent', () => {
  let component: EquipmenttypemanagementComponent;
  let fixture: ComponentFixture<EquipmenttypemanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmenttypemanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmenttypemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

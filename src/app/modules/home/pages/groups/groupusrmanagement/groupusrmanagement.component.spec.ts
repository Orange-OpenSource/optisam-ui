import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupusrmanagementComponent } from './groupusrmanagement.component';

describe('GroupusrmanagementComponent', () => {
  let component: GroupusrmanagementComponent;
  let fixture: ComponentFixture<GroupusrmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupusrmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupusrmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

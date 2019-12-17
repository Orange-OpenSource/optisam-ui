import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupmangementComponent } from './groupmangement.component';

describe('GroupmangementComponent', () => {
  let component: GroupmangementComponent;
  let fixture: ComponentFixture<GroupmangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupmangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupmangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

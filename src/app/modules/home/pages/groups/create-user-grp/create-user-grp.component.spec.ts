import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserGrpComponent } from './create-user-grp.component';

describe('CreateUserGrpComponent', () => {
  let component: CreateUserGrpComponent;
  let fixture: ComponentFixture<CreateUserGrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUserGrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUserGrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

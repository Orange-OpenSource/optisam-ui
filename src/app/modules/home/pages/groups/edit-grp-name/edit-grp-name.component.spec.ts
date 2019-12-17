import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGrpNameComponent } from './edit-grp-name.component';

describe('EditGrpNameComponent', () => {
  let component: EditGrpNameComponent;
  let fixture: ComponentFixture<EditGrpNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGrpNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGrpNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

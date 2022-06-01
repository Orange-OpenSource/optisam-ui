import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTopSectionComponent } from './edit-top-section.component';

describe('EditTopSectionComponent', () => {
  let component: EditTopSectionComponent;
  let fixture: ComponentFixture<EditTopSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTopSectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTopSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});

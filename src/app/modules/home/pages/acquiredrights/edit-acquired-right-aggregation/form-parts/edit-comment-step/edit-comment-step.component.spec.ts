import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommentStepComponent } from './edit-comment-step.component';

describe('EditCommentStepComponent', () => {
  let component: EditCommentStepComponent;
  let fixture: ComponentFixture<EditCommentStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCommentStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommentStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});

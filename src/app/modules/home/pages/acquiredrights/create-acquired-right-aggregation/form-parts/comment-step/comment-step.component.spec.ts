import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentStepComponent } from './comment-step.component';

describe('CommentStepComponent', () => {
  let component: CommentStepComponent;
  let fixture: ComponentFixture<CommentStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentStepComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});

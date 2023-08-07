import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSourcerConfirmationComponent } from './delete-sourcer-confirmation.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DeleteSourcerConfirmationComponent', () => {
  let component: DeleteSourcerConfirmationComponent;
  let fixture: ComponentFixture<DeleteSourcerConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteSourcerConfirmationComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSourcerConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

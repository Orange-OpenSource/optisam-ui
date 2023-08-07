import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { SimpleConfirmationComponent } from './simple-confirmation.component';

describe('SimpleConfirmationComponent', () => {
  let component: SimpleConfirmationComponent;
  let fixture: ComponentFixture<SimpleConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleConfirmationComponent],
      providers: [{ provide: MatDialogRef, useValue: {} }],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

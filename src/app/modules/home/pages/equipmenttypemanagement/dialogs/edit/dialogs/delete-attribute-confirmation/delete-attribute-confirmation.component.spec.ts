import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { DeleteAttributeConfirmationComponent } from './delete-attribute-confirmation.component';

describe('DeleteAttributeConfirmationComponent', () => {
  let component: DeleteAttributeConfirmationComponent;
  let fixture: ComponentFixture<DeleteAttributeConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteAttributeConfirmationComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAttributeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

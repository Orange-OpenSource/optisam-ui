import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { DeleteAllocatedMetricConfirmationDialogComponent } from './delete-allocated-metric-confirmation-dialog.component';

describe('DeleteAllocatedMetricConfirmationDialogComponent', () => {
  let component: DeleteAllocatedMetricConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteAllocatedMetricConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteAllocatedMetricConfirmationDialogComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      DeleteAllocatedMetricConfirmationDialogComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});

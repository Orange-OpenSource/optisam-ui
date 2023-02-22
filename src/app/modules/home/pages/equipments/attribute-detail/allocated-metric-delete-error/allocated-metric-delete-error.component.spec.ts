import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedMetricDeleteErrorComponent } from './allocated-metric-delete-error.component';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('AllocatedMetricDeleteErrorComponent', () => {
  let component: AllocatedMetricDeleteErrorComponent;
  let fixture: ComponentFixture<AllocatedMetricDeleteErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllocatedMetricDeleteErrorComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocatedMetricDeleteErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   component.data = {
  //     error: {
  //       code: 404,
  //       message: 'Not found',
  //       details: [],
  //     },
  //   };
  //   expect(component).toBeTruthy();
  // });
});

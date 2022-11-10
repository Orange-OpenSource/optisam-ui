import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { WarningAllocationChangeComponent } from './warning-allocation-change.component';

describe('WarningAllocationChangeComponent', () => {
  let component: WarningAllocationChangeComponent;
  let fixture: ComponentFixture<WarningAllocationChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarningAllocationChangeComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningAllocationChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

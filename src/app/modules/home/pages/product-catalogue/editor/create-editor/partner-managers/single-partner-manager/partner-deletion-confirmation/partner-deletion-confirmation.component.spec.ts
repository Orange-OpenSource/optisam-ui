import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerDeletionConfirmationComponent } from './partner-deletion-confirmation.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('PartnerDeletionConfirmationComponent', () => {
  let component: PartnerDeletionConfirmationComponent;
  let fixture: ComponentFixture<PartnerDeletionConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartnerDeletionConfirmationComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerDeletionConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

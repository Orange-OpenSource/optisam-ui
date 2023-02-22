import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditDeletionConfirmationComponent } from './audit-deletion-confirmation.component';
import { TranslateModule } from '@ngx-translate/core';

describe('AuditDeletionConfirmationComponent', () => {
  let component: AuditDeletionConfirmationComponent;
  let fixture: ComponentFixture<AuditDeletionConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditDeletionConfirmationComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditDeletionConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { AuditsComponent } from './audits.component';

describe('AuditsComponent', () => {
  let component: AuditsComponent;
  let fixture: ComponentFixture<AuditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditsComponent],
      providers: [FormBuilder, ControlContainer],
      imports: [MatDialogModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

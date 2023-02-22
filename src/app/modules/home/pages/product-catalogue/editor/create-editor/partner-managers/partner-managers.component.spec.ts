import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormBuilder } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { PartnerManagersComponent } from './partner-managers.component';

describe('PartnerManagersComponent', () => {
  let component: PartnerManagersComponent;
  let fixture: ComponentFixture<PartnerManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartnerManagersComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [FormBuilder, ControlContainer],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

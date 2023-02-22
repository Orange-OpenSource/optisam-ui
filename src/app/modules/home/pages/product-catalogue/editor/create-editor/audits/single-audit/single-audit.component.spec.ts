import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomMaterialModule } from 'src/app/material.module';

import { SingleAuditComponent } from './single-audit.component';
import { MatDialog } from '@angular/material/dialog';
import { ControlContainer } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SingleAuditComponent', () => {
  let component: SingleAuditComponent;
  let fixture: ComponentFixture<SingleAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleAuditComponent],
      imports: [
        CustomMaterialModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [ControlContainer],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

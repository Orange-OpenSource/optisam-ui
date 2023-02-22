import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePartnerManagerComponent } from './single-partner-manager.component';
import { ControlContainer } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SinglePartnerManagerComponent', () => {
  let component: SinglePartnerManagerComponent;
  let fixture: ComponentFixture<SinglePartnerManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SinglePartnerManagerComponent],
      providers: [ControlContainer],
      imports: [
        CustomMaterialModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePartnerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

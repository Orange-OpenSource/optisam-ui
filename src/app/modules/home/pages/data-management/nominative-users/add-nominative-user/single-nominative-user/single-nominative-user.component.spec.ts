import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { SingleNominativeUserComponent } from './single-nominative-user.component';

describe('SingleNominativeUserComponent', () => {
  let component: SingleNominativeUserComponent;
  let fixture: ComponentFixture<SingleNominativeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [SingleNominativeUserComponent],
      providers: [
        FormBuilder,
        ControlContainer,
        { provide: MatDialog, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleNominativeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetExpenditureComponent } from './set-expenditure.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('SetExpenditureComponent', () => {
  let component: SetExpenditureComponent;
  let fixture: ComponentFixture<SetExpenditureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetExpenditureComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetExpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleGlobalAccountManagerComponent } from './single-global-account-manager.component';
import { ControlContainer } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('SingleGlobalAccountManagerComponent', () => {
  let component: SingleGlobalAccountManagerComponent;
  let fixture: ComponentFixture<SingleGlobalAccountManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleGlobalAccountManagerComponent],
      providers: [ControlContainer],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleGlobalAccountManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

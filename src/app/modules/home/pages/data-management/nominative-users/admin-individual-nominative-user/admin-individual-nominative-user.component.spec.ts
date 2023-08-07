import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '@core/services';

import { AdminIndividualNominativeUserComponent } from './admin-individual-nominative-user.component';

describe('AdminIndividualNominativeUserComponent', () => {
  let component: AdminIndividualNominativeUserComponent;
  let fixture: ComponentFixture<AdminIndividualNominativeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
      ],
      declarations: [AdminIndividualNominativeUserComponent],
      providers: [ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminIndividualNominativeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

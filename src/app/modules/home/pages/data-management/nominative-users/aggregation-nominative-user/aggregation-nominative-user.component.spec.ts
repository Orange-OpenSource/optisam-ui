import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '@core/services';

import { AggregationNominativeUserComponent } from './aggregation-nominative-user.component';
import { TranslateModule } from '@ngx-translate/core';

describe('AggregationNominativeUserComponent', () => {
  let component: AggregationNominativeUserComponent;
  let fixture: ComponentFixture<AggregationNominativeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
      ],
      declarations: [AggregationNominativeUserComponent],
      providers: [ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationNominativeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductService } from '@core/services';

import { AggregationConcurrentUserComponent } from './aggregation-concurrent-user.component';
import { TranslateModule } from '@ngx-translate/core';

describe('AggregationConcurrentUserComponent', () => {
  let component: AggregationConcurrentUserComponent;
  let fixture: ComponentFixture<AggregationConcurrentUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
      ],
      declarations: [AggregationConcurrentUserComponent],
      providers: [ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationConcurrentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

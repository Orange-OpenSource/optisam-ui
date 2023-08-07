import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAggregationConcurrentUserComponent } from './product-aggregation-concurrent-user.component';
import { ProductService } from '@core/services';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductAggregationConcurrentUserComponent', () => {
  let component: ProductAggregationConcurrentUserComponent;
  let fixture: ComponentFixture<ProductAggregationConcurrentUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductAggregationConcurrentUserComponent],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ProductAggregationConcurrentUserComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

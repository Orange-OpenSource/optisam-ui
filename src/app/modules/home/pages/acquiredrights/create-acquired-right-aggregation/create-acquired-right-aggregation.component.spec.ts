import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '@core/services/product.service';

import { CreateAcquiredRightAggregationComponent } from './create-acquired-right-aggregation.component';

describe('CreateAcquiredRightAggregationComponent', () => {
  let component: CreateAcquiredRightAggregationComponent;
  let fixture: ComponentFixture<CreateAcquiredRightAggregationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAcquiredRightAggregationComponent],
      imports: [
        CustomMaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [FormBuilder, ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAcquiredRightAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});

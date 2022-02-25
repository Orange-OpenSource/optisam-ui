import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAcquiredRightAggregationComponent } from './edit-acquired-right-aggregation.component';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomMaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/core/services/product.service';
import { UniqueProductPipe } from '@home/pages/acquiredrights/unique-product.pipe';

describe('EditAcquiredRightAggregationComponent', () => {
  let component: EditAcquiredRightAggregationComponent;
  let fixture: ComponentFixture<EditAcquiredRightAggregationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          EditAcquiredRightAggregationComponent,
          UniqueProductPipe,
        ],
        imports: [
          ReactiveFormsModule,
          HttpClientTestingModule,
          CustomMaterialModule,
          BrowserAnimationsModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          ProductService,
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: {} },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAcquiredRightAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});

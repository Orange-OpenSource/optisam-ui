import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { ShareAggregationComponent } from './share-aggregation.component';

describe('ShareAggregationComponent', () => {
  let component: ShareAggregationComponent;
  let fixture: ComponentFixture<ShareAggregationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ReactiveFormsModule,
        FormsModule,MatDialogModule,HttpClientTestingModule,TranslateModule.forRoot(),RouterTestingModule],
      declarations: [ ShareAggregationComponent ],
      providers:[ControlContainer,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },ProductService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAggregationComponent } from './list-aggregation.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomMaterialModule } from 'src/app/material.module';
import { ProductService } from 'src/app/core/services/product.service';

describe('ListAggregationComponent', () => {
  let component: ListAggregationComponent;
  let fixture: ComponentFixture<ListAggregationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAggregationComponent ],
      imports : [
                  CustomMaterialModule,
                  HttpClientTestingModule,
                  TranslateModule.forRoot()
                ],
      providers : [ProductService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});

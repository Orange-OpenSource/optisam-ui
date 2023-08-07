import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListThumbnailComponent } from './products-list-thumbnail.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductsListThumbnailComponent', () => {
  let component: ProductsListThumbnailComponent;
  let fixture: ComponentFixture<ProductsListThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsListThumbnailComponent],
      imports: [
        HttpClientTestingModule,
        CustomMaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [FormBuilder],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

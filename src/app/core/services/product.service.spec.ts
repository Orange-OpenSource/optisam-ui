import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule, 
      HttpClientTestingModule
    ],
    providers: [ProductService]}));

  it('should be created', () => {
    const service: ProductService = TestBed.inject(ProductService);
    expect(service).toBeTruthy();
  });
});

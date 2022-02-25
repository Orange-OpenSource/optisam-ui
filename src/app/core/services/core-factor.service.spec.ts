import { TestBed } from '@angular/core/testing';

import { CoreFactorService } from './core-factor.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('CoreFactorService', () => {
  let service: CoreFactorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoreFactorService],
    });
    service = TestBed.inject(CoreFactorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

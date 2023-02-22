import { TestBed } from '@angular/core/testing';

import { CoreFactorService } from './core-factor.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
describe('CoreFactorService', () => {
  let service: CoreFactorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [CoreFactorService],
    });
    service = TestBed.inject(CoreFactorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

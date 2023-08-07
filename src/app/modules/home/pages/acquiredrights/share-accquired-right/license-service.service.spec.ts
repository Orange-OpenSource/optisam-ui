import { TestBed } from '@angular/core/testing';

import { LicenseServiceService } from './license-service.service';

describe('LicenseServiceService', () => {
  let service: LicenseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LicenseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

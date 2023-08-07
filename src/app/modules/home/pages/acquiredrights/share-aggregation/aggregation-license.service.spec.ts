import { TestBed } from '@angular/core/testing';

import { AggregationLicenseService } from './aggregation-license.service';

describe('AggregationLicenseService', () => {
  let service: AggregationLicenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AggregationLicenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

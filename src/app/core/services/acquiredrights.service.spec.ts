import { TestBed } from '@angular/core/testing';

import { AcquiredrightsService } from './acquiredrights.service';

describe('AcquiredrightsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcquiredrightsService = TestBed.get(AcquiredrightsService);
    expect(service).toBeTruthy();
  });
});

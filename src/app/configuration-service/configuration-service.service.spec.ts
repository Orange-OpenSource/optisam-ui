import { TestBed } from '@angular/core/testing';

import { ConfigurationServiceService } from './configuration-service.service';

describe('ConfigurationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigurationServiceService = TestBed.get(ConfigurationServiceService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DataManagementService } from './data-management.service';

describe('DataManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataManagementService = TestBed.get(DataManagementService);
    expect(service).toBeTruthy();
  });
});

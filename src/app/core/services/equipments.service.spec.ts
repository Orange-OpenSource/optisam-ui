import { TestBed } from '@angular/core/testing';

import { EquipmentsService } from './equipments.service';

describe('EquipmentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EquipmentsService = TestBed.get(EquipmentsService);
    expect(service).toBeTruthy();
  });
});

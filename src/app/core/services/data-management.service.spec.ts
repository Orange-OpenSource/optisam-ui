import { TestBed } from '@angular/core/testing';

import { DataManagementService } from './data-management.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DataManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule, 
      HttpClientTestingModule
    ],
    providers: [DataManagementService]}));

  it('should be created', () => {
    const service: DataManagementService = TestBed.inject(DataManagementService);
    expect(service).toBeTruthy();
  });
});

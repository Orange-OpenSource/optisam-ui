import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule, 
      HttpClientTestingModule
    ],
    providers: [ConfigurationService]}));

  it('should be created', () => {
    const service: ConfigurationService = TestBed.inject(ConfigurationService);
    expect(service).toBeTruthy();
  });
});

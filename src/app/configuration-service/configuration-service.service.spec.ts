import { TestBed } from '@angular/core/testing';

import { ConfigurationServiceService } from './configuration-service.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ConfigurationServiceService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: ConfigurationServiceService = TestBed.inject(ConfigurationServiceService);
    expect(service).toBeTruthy();
  });
});

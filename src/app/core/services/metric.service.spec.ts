// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { TestBed } from '@angular/core/testing';

import { MetricService } from './metric.service';

describe('MetricService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MetricService = TestBed.get(MetricService);
    expect(service).toBeTruthy();
  });
});

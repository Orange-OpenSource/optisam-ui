import { TestBed } from '@angular/core/testing';

import { MetricService } from './metric.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MetricService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ],
    providers: [MetricService]}));

  it('should be created', () => {
    const service: MetricService = TestBed.inject(MetricService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule, 
      HttpClientTestingModule
    ],
    providers: [ReportService]}));

  it('should be created', () => {
    const service: ReportService = TestBed.inject(ReportService);
    expect(service).toBeTruthy();
  });
});

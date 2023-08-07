import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('ReportService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        TranslateModule.forRoot(),
      ],
      providers: [ReportService],
    })
  );
  // TODO: added new comment for testing only ( you can remove this comment any time)
  it('should be created', () => {
    const service: ReportService = TestBed.inject(ReportService);
    expect(service).toBeTruthy();
  });
});

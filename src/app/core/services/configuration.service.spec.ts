import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from './configuration.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('ConfigurationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      providers: [ConfigurationService],
    })
  );

  it('should be created', () => {
    const service: ConfigurationService = TestBed.inject(ConfigurationService);
    expect(service).toBeTruthy();
  });
});

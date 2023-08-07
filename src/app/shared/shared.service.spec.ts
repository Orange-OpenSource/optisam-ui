import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { SharedService } from './shared.service';

describe('SharedService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ],
    })
  );

  it('should be created', () => {
    const service: SharedService = TestBed.inject(SharedService);
    expect(service).toBeTruthy();
  });
});

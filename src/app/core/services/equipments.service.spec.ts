import { TestBed } from '@angular/core/testing';

import { EquipmentsService } from './equipments.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('EquipmentsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      providers: [EquipmentsService],
    })
  );

  it('should be created', () => {
    const service: EquipmentsService = TestBed.inject(EquipmentsService);
    expect(service).toBeTruthy();
  });
});

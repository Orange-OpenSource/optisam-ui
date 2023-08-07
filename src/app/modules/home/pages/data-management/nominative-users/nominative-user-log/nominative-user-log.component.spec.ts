import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominativeUserLogComponent } from './nominative-user-log.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService } from '@core/services';

describe('NominativeUserLogComponent', () => {
  let component: NominativeUserLogComponent;
  let fixture: ComponentFixture<NominativeUserLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NominativeUserLogComponent],
      providers: [ProductService, { provide: MatDialog, useValue: {} }],
      imports: [RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominativeUserLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

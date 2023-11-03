import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMetricsComponent } from './import-metrics.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ImportMetricsComponent', () => {
  let component: ImportMetricsComponent;
  let fixture: ComponentFixture<ImportMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportMetricsComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule],
      providers: [{ provide: MatDialogRef, useValue: {} }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

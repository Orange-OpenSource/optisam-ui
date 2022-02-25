import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricDetailsComponent } from './metric-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('MetricDetailsComponent', () => {
  let component: MetricDetailsComponent;
  let fixture: ComponentFixture<MetricDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MetricDetailsComponent,
        LoadingSpinnerComponent
      ],
      imports: [
        CustomMaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'Metric Details'", () => {
    const viewMetricHeading = fixture.nativeElement.querySelector('mat-card-title');
    expect(viewMetricHeading.innerText).toBe('Metric Details');
  })
});

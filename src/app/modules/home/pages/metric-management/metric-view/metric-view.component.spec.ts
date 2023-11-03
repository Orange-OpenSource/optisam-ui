import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricViewComponent } from './metric-view.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MetricViewComponent', () => {
  let component: MetricViewComponent;
  let fixture: ComponentFixture<MetricViewComponent>;
  const metricData = [
    {
      type: 'Metric type 1',
      name: 'Metric 1',
      description: '....',
    },
    {
      type: 'Metric type 2',
      name: 'Metric 2',
      description: '....',
    },
  ];
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MetricViewComponent, LoadingSpinnerComponent],
      imports: [
        CustomMaterialModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        EquipmentTypeManagementService,
        { provide: MatDialog, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricViewComponent);
    component = fixture.componentInstance;
    component.MyDataSource = new MatTableDataSource(metricData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("page heading should be 'Metrics Management'", () => {
    const viewMetricHeading =
      fixture.nativeElement.querySelector('div.page-heading');
    expect(viewMetricHeading.innerText).toBe('Metrics Management');
  });

  it("'Add Metric' button should be visible to Admin user", () => {
    component.role = 'ADMIN';
    fixture.detectChanges();
    const addMetricBtn = fixture.nativeElement.querySelector(
      'button#addNewMetricButton'
    );
    expect(addMetricBtn).toBeTruthy();
  });

  it("'Add Metric' button should be visible to Super Admin user", () => {
    component.role = 'SUPER_ADMIN';
    fixture.detectChanges();
    const addMetricBtn = fixture.nativeElement.querySelector(
      'button#addNewMetricButton'
    );
    expect(addMetricBtn).toBeTruthy();
  });

  it("'Add Metric' button should not be visible to normal user", () => {
    component.role = 'USER';
    fixture.detectChanges();
    const addMetricBtn = fixture.nativeElement.querySelector(
      'button#addNewMetricButton'
    );
    expect(addMetricBtn).toBeFalsy();
  });

  it('metric name should be underlined on hover', () => {
    fixture.detectChanges(); // Initial change detection

    fixture.whenStable().then(() => {
      fixture.detectChanges(); // Detect changes after async operations complete

      const row = fixture.nativeElement.querySelectorAll('.mat-cell')[1];
      console.log('row element from spec file', fixture.nativeElement);
      if (!row) return;
      row?.dispatchEvent(
      new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    );
    fixture.detectChanges();
    expect(row.classList).toContain('highlight');
    });

  });
});

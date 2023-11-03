import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareMaintenanceComponent } from './software-maintenance.component';
import { ProductService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FrenchNumberPipe } from '@shared/common-pipes/french-number.pipe';

describe('SoftwareMaintenanceComponent', () => {
  let component: SoftwareMaintenanceComponent;
  let fixture: ComponentFixture<SoftwareMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoftwareMaintenanceComponent, FrenchNumberPipe],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule],
      providers: [ProductService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareSimulationComponent } from './hardware-simulation.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { CustomMaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HardwareSimulationComponent', () => {
  let component: HardwareSimulationComponent;
  let fixture: ComponentFixture<HardwareSimulationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      HardwareSimulationComponent,
                      LoadingSpinnerComponent
                    ],
      imports : [ 
                  CustomMaterialModule,
                  HttpClientTestingModule,
                  BrowserAnimationsModule,
                  FormsModule,
                  TranslateModule.forRoot()
                ],
      providers:[
                  EquipmentTypeManagementService
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricSimulationComponent } from './metric-simulation.component';
import { TranslateModule } from '@ngx-translate/core';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { CustomMaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';

describe('MetricSimulationComponent', () => {
  let component: MetricSimulationComponent;
  let fixture: ComponentFixture<MetricSimulationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricSimulationComponent ],
      imports : [ 
                  CustomMaterialModule,
                  HttpClientTestingModule,
                  BrowserAnimationsModule,
                  FormsModule,
                  TranslateModule.forRoot()
                ],
      providers:[
                  ProductService,
                  EquipmentTypeManagementService
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationSimulationComponent } from './configuration-simulation.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfigurationSimulationComponent', () => {
  let component: ConfigurationSimulationComponent;
  let fixture: ComponentFixture<ConfigurationSimulationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationSimulationComponent ],
      imports : [ 
                  CustomMaterialModule,
                  FormsModule,
                  ReactiveFormsModule,
                  HttpClientTestingModule,
                  RouterTestingModule,
                  BrowserAnimationsModule,
                  TranslateModule.forRoot()
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

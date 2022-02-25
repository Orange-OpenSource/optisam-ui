import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationComponent } from './simulation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomMaterialModule } from 'src/app/material.module';
import { TranslateModule } from '@ngx-translate/core';

describe('SimulationComponent', () => {
  let component: SimulationComponent;
  let fixture: ComponentFixture<SimulationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationComponent ],
      imports : [ 
                  CustomMaterialModule,
                  RouterTestingModule,
                  TranslateModule.forRoot()
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

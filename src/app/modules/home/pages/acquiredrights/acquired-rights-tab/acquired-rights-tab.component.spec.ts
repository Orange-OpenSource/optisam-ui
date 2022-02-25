import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AcquiredRightsTabComponent } from './acquired-rights-tab.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CustomMaterialModule } from 'src/app/material.module';

describe('AcquiredRightsTabComponent', () => {
  let component: AcquiredRightsTabComponent;
  let fixture: ComponentFixture<AcquiredRightsTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AcquiredRightsTabComponent ],
      imports : [ 
                  RouterTestingModule,
                  CustomMaterialModule,
                  TranslateModule.forRoot() 
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquiredRightsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

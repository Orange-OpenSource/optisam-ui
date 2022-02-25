import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AplDetailsComponent } from './apl-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApplicationService } from 'src/app/core/services/application.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomMaterialModule } from 'src/app/material.module';
import { MatDialog } from '@angular/material/dialog';

describe('AplDetailsComponent', () => {
  let component: AplDetailsComponent;
  let fixture: ComponentFixture<AplDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      AplDetailsComponent
                    ],
      imports : [
                  CustomMaterialModule,
                  HttpClientTestingModule,
                  RouterTestingModule,
                  BrowserAnimationsModule,
                  SharedModule,
                  TranslateModule.forRoot()
                ],
      providers : [ 
                    ApplicationService,
                    { provide: MatDialog, useValue: {} }
                  ],
      schemas : [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AplDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

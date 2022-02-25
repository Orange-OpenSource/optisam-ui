import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AplComponent } from './apl.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApplicationService } from 'src/app/core/services/application.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomMaterialModule } from 'src/app/material.module';


describe('ApplicationComponent', () => {
  let component: AplComponent;
  let fixture: ComponentFixture<AplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      AplComponent
                    ],
      imports : [
                  CustomMaterialModule,
                  FormsModule,
                  HttpClientTestingModule,
                  RouterTestingModule,
                  BrowserAnimationsModule,
                  SharedModule,
                  TranslateModule.forRoot()
                ],
      providers : [ ApplicationService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

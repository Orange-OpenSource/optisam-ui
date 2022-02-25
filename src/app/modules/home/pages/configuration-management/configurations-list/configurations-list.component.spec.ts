import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationsListComponent } from './configurations-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomMaterialModule } from 'src/app/material.module';

describe('ConfigurationsListComponent', () => {
  let component: ConfigurationsListComponent;
  let fixture: ComponentFixture<ConfigurationsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      ConfigurationsListComponent,
                      LoadingSpinnerComponent
                    ],
      imports : [
                  CustomMaterialModule,
                  HttpClientTestingModule,
                  TranslateModule.forRoot()
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

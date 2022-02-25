import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdEquiComponent } from './prod-equi.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdvanceSearchComponent } from 'src/app/shared/advance-search/advance-search.component';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProdEquiComponent', () => {
  let component: ProdEquiComponent;
  let fixture: ComponentFixture<ProdEquiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      ProdEquiComponent,
                      AdvanceSearchComponent,
                      LoadingSpinnerComponent
                    ],
      imports : [ 
                  CustomMaterialModule,
                  FormsModule,
                  HttpClientTestingModule,
                  RouterTestingModule,
                  BrowserAnimationsModule,
                  TranslateModule.forRoot()
                ],
      providers:[
                  EquipmentTypeManagementService
                ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdEquiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

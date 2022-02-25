import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentsListComponent } from './equipments-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { AdvanceSearchComponent } from 'src/app/shared/advance-search/advance-search.component';
import { LoadingSpinnerComponent } from 'src/app/shared/loading-spinner/loading-spinner.component';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EquipmentTypeManagementService } from 'src/app/core/services/equipmenttypemanagement.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EquipmentsListComponent', () => {
  let component: EquipmentsListComponent;
  let fixture: ComponentFixture<EquipmentsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ 
                      EquipmentsListComponent,
                      AdvanceSearchComponent,
                      LoadingSpinnerComponent
                    ],
      imports : [ 
                  FormsModule,
                  CustomMaterialModule,
                  HttpClientTestingModule,
                  BrowserAnimationsModule,
                  TranslateModule.forRoot() 
                ],
      providers : [
                    EquipmentTypeManagementService
                  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
